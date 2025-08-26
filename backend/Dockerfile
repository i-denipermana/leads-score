FROM python:3.11-slim

WORKDIR /app

# Copy requirements from backend folder
COPY backend/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

# Copy backend code and data
COPY backend /app/backend

EXPOSE 5000

ENV FLASK_APP=backend.app:create_app
ENV FLASK_RUN_HOST=0.0.0.0
CMD ["flask", "run", "--port=5000", "--debug"]
