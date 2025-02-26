# Base Image for building
FROM golang:1.23.3-alpine AS builder

WORKDIR /app

COPY . .

RUN go mod download

RUN go build -o onitama-serve ./cmd/onitama-serve

FROM alpine:latest

COPY --from=builder /app/onitama-serve /app/onitama-serve
COPY --from=builder /app/assets/ /app/assets/

ENV CARD_CONFIG_FILE=/app/assets/cards.json

EXPOSE 8080

CMD ["./app/onitama-serve"]
