# Stage 1: Build the Vite client
FROM node:22 AS client_build
WORKDIR /app/client

ENV VITE_BASE_URL="https://learnpro-mha4s7stfa-el.a.run.app"

# Copy package files and install dependencies
COPY client/package*.json ./
RUN npm install
# Copy the rest of the client source and build
COPY client/ .
RUN npm run build

# Stage 2: Set up the FastAPI backend
FROM python:3.12.3
WORKDIR /app
# Install FastAPI and Uvicorn (add other dependencies as needed)
COPY server/requirements.txt ./requirements.txt

RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend source code
COPY server/ ./


# Copy the built static assets from the client build stage into a folder (e.g. server/static)
COPY --from=client_build /app/client/dist/ ./static/
COPY --from=client_build /app/client/dist/assets/ ./assets/ 

# Expose the port that Uvicorn will run on
EXPOSE 8000

# Start FastAPI with Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

# from node:22 as client_build

# WORKDIR /code
# COPY ./client /code
# RUN npm install
# RUN npm run build

# # Stage 2 - Uses Frontend Files
# from python:3.12.3
# WORKDIR /code
# COPY ./server/requirements.txt /code/requirements.txt
# RUN pip install -r requirements.txt
# COPY --from=client_build /code/build/static/ /code/static/
# COPY --from=client_build /code/build/ /code/static/
# COPY ./server /code

# # CMD ["gunicorn"  , "-b", "0.0.0.0:8000", "core.wsgi:application"]
# CMD ["uicorn "  , "main:app", "--reload"]
