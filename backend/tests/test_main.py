from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_healthcheck() -> None:
    response = client.get("/health/")
    assert response.status_code == 200
    assert response.json()["message"] == "ok"


def test_register_and_login_flow() -> None:
    payload = {"email": "player@example.com", "username": "player", "password": "secret"}
    register_response = client.post("/auth/register", json=payload)
    assert register_response.status_code == 201

    login_response = client.post("/auth/login", json={"email": payload["email"], "password": payload["password"]})
    assert login_response.status_code == 200
    body = login_response.json()
    assert body["token_type"] == "bearer"
    assert "access_token" in body
