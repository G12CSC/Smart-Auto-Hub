#!/bin/bash

set -e

echo "=================================="
echo "Car Ingestion Started"
echo "=================================="

source ../../virtual_environments/venv_ChatBot/bin/activate

if [ -f .env ]; then
	echo "Loading environment variabels"
	export $(grep -v '^#' .env | xargs)
else
	echo ".env file not found!"
	exit -1
fi

echo "Running car ingestion pipeline....."

python -m app.ingest.car_ingest


echo "================================="
echo "Ingestion Completed Successfully 🚀🚀🚀"
echo "================================="
