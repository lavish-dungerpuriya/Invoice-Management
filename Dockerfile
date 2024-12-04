FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Copy the requirements file
COPY requirements.txt .

# Install system dependencies for psycopg2 and other Python dependencies
RUN apt-get update && apt-get install -y libpq-dev gcc && \
    pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application files
COPY . .

# Expose port 8000
EXPOSE 8000

# Run the Django development server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
