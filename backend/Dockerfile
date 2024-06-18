# Use the official Python image from the Docker Hub
FROM python:3.10.14-alpine3.20

# Set the working directory in the container
WORKDIR /backend

# Copy the requirements file into the container
COPY requirements.txt .

# Install the required dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code into the container
COPY . .

# Expose the port the app runs on
EXPOSE 8000

# Command to run the application
CMD ["python3", "server.py"]



