from django.shortcuts import render

# Create your views here.
import pandas as pd
import sqlite3
import re
import google.generativeai as genai
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.files.storage import default_storage

# Configure Google Generative AI
genai.configure(api_key="YOUR_GOOGLE_GENERATIVE_AI_API_KEY")
model = genai.GenerativeModel('gemini-1.5-flash')

# Utility function for creating SQLite in-memory DB
def create_sqlite_db(df):
    conn = sqlite3.connect(':memory:')
    df.to_sql('data', conn, index=False, if_exists='replace')
    return conn

# Upload API
# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import pandas as pd
import sqlite3

class UploadData(APIView):
    def post(self, request):
        file = request.FILES.get('file')
        if not file:
            return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)
        
        file_extension = file.name.split('.')[-1]
        try:
            if file_extension == 'csv':
                # Use the Python engine to handle complex parsing cases
                df = pd.read_csv(file, engine='python', on_bad_lines='skip')
            elif file_extension in ['xlsx', 'xls']:
                df = pd.read_excel(file)
            else:
                return Response({"error": "Unsupported file type"}, status=status.HTTP_400_BAD_REQUEST)
            
            # Check if DataFrame is empty
            if df.empty:
                return Response({"error": "Uploaded file is empty or not readable"}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({"error": f"Failed to process file: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

        # Save DataFrame to SQLite in-memory database (for this request only)
        conn = sqlite3.connect(':memory:')
        df.to_sql('data', conn, index=False, if_exists='replace')

        # Example: Query the data immediately if needed
        # You can query the data here or return the DataFrame structure as required
        columns = list(df.columns)

        # Close the connection after use to clean up
        conn.close()

        return Response({"message": "File uploaded successfully", "columns": columns})


# Process Query API
class ProcessQuery(APIView):
    def post(self, request):
        prompt = request.data.get('prompt')
        conn = request.session.get('db_conn')
        if not prompt or not conn:
            return Response({"error": "Invalid request"}, status=status.HTTP_400_BAD_REQUEST)

        queries = re.split(r'\band\b', prompt)  # Split prompt by "and"
        results = []

        for query in queries:
            query = query.strip()
            prompt_text = f"""Convert this prompt to SQL query: '{query}'"""
            response = model.generate_content(prompt_text)
            sql_query = response.text.strip().replace("```", "")

            # Execute SQL query
            try:
                result_df = pd.read_sql_query(sql_query, conn)
                results.append(result_df.to_dict(orient='records'))
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"results": results})

# Visualization API (to provide cleaned data)
# class GetCleanedData(APIView):
#     def post(self, request):
#         user_prompt = request.data.get("prompt", "")
        
#         # Simulate a dataset and process it based on the user prompt
#         # Replace this with your data cleaning and filtering logic
#         raw_data = {
#             "Category": ["A", "B", "C", "A", "B", "C"],
#             "Value": [10, 20, 30, 15, 25, 35]
#         }
#         df = pd.DataFrame(raw_data)
        
#         # Example filtering based on user prompt (this should be customized)
#         if "high value" in user_prompt.lower():
#             cleaned_df = df[df["Value"] > 20]
#         else:
#             cleaned_df = df

#         # Convert cleaned data to JSON format for frontend
#         data = {
#             "columns": list(cleaned_df.columns),
#             "rows": cleaned_df.to_dict(orient="records")
#         }
#         return Response(data, status=status.HTTP_200_OK)
    

class GetChartRecommendations(APIView):
    def post(self, request):
        user_prompt = request.data.get("prompt", "")

        # Use Google Gemini API to generate SQL query based on the prompt
        sql_prompt = f"Generate an SQL query based on the following prompt: {user_prompt}"
        try:
            sql_response = genai.generate_content(sql_prompt)
            sql_query = sql_response.text.strip()

            # Execute SQL query in SQLite (assuming table is `data`)
            conn = sqlite3.connect(':memory:')
            # Replace with actual data source or setup in-memory example data
            df = pd.read_sql_query(sql_query, conn)

            # Get chart recommendations based on cleaned data
            chart_prompt = f"Recommend suitable chart types and necessary data columns for visualizing the following data:\n\n{df.head(10).to_json(orient='records')}"
            chart_response = genai.generate_content(chart_prompt)
            recommended_charts = chart_response.text.strip()  # Expected JSON with chart types and necessary columns

            return Response({
                "columns": list(df.columns),
                "rows": df.to_dict(orient="records"),
                "chart_recommendations": recommended_charts  # e.g., [{"chartType": "Bar", "x": "Category", "y": "Value"}]
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
