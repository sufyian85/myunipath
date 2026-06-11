FROM php:8.2-cli

RUN apt-get update && apt-get install -y \
    git unzip curl libzip-dev libsqlite3-dev bash \
        && docker-php-ext-install pdo pdo_sqlite zip \
            && curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

            WORKDIR /app

            COPY backend/composer.json backend/composer.lock ./
            RUN composer install --no-dev --optimize-autoloader --no-scripts

            COPY backend/ .
            RUN composer dump-autoload --optimize

            # Set up .env with SQLite (no external DB needed)
            RUN cp .env.example .env \
                && sed -i 's/DB_CONNECTION=mysql/DB_CONNECTION=sqlite/' .env \
                    && sed -i '/^DB_HOST/d' .env \
                        && sed -i '/^DB_PORT/d' .env \
                            && sed -i '/^DB_DATABASE/d' .env \
                                && sed -i '/^DB_USERNAME/d' .env \
                                    && sed -i '/^DB_PASSWORD/d' .env \
                                        && echo "DB_DATABASE=/app/database/database.sqlite" >> .env \
                                            && sed -i 's/SESSION_DRIVER=database/SESSION_DRIVER=file/' .env \
                                                && sed -i 's/CACHE_STORE=database/CACHE_STORE=file/' .env \
                                                    && mkdir -p /app/database \
                                                            /app/storage/logs \
                                                                    /app/storage/framework/sessions \
                                                                            /app/storage/framework/views \
                                                                                    /app/storage/framework/cache \
                                                                                        && touch /app/database/database.sqlite \
                                                                                            && chmod -R 777 /app/storage /app/bootstrap/cache \
                                                                                                && php artisan key:generate --force

                                                                                                EXPOSE 8000

                                                                                                CMD bash -c "php artisan migrate --force && exec php artisan serve --host=0.0.0.0 --port=${PORT:-8000} 2>&1"
                                                                                                
