#! /bin/bash

SERVICE_NAME="ed-galnet-scraper"

# Параметры развёртывания
IMAGE_NAME="${SERVICE_NAME}_image"
CONTAINER_NAME="${SERVICE_NAME}_container"
DEPLOY_TAG="deploy"
PROD_TAG="prod"

# Сборка деплой образа
docker image build -t $IMAGE_NAME:$DEPLOY_TAG . 2> /dev/null

# Выяснение успешности выполнения сборки деплой образа
LINES=$(docker image list | egrep "$IMAGE_NAME\s+$DEPLOY_TAG" | wc -l)

# Если сборка прошла успешно...
if [ $LINES -eq 1 ]
then
    # Остановка контейнера приложения
    docker container stop $CONTAINER_NAME 2> /dev/null

    # Удаление контейнера приложения
    docker container rm $CONTAINER_NAME 2> /dev/null

    # Удаление прод образа
    docker image rm $IMAGE_NAME:$PROD_TAG 2> /dev/null

    # Тегирование деплой образа как прод
    docker tag $IMAGE_NAME:$DEPLOY_TAG $IMAGE_NAME:$PROD_TAG 2> /dev/null

    # Развёртывание приложения
    docker run --restart always -d \
        -e PROD="TRUE" \
        --name $CONTAINER_NAME \
        $IMAGE_NAME:$PROD_TAG
fi

# Удаление деплой образа
docker image rm $IMAGE_NAME:$DEPLOY_TAG 2> /dev/null
