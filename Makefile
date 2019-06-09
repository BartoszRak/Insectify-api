down:
	docker-compose down

clean: down
	docker-compose rm -f

dev: down
	docker-compose up --build -d

shell:
	docker-compose exec node-server bash
