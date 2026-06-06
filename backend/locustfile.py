from locust import HttpUser, task, between


class BackendUser(HttpUser):
    wait_time = between(1, 2)

    token = None

    # ---------- AUTH ----------
    def on_start(self):
        """Login once per user and save JWT token"""
        res = self.client.post("/api/auth/login", json={
            "email": "andrii.client@macro.local",
            "password": "Test12345!"
        })

        try:
            data = res.json()
            self.token = data.get("data", {}).get("token")
        except Exception:
            self.token = None

    # ---------- HELPERS ----------
    def auth_headers(self):
        if not self.token:
            return {}
        return {"Authorization": f"Bearer {self.token}"}

    # ---------- AUTH ENDPOINTS ----------
    @task(2)
    def me(self):
        self.client.get("/api/auth/me", headers=self.auth_headers())

    # ---------- PRODUCTS ----------
    @task(3)
    def get_products(self):
        self.client.get("/api/products", headers=self.auth_headers())

    @task(2)
    def search_products(self):
        self.client.get("/api/products?search=a", headers=self.auth_headers())

    # ---------- MEALS ----------
    @task(3)
    def meals_history(self):
        self.client.get("/api/meals/history", headers=self.auth_headers())

    @task(2)
    def meals_by_date(self):
        self.client.get("/api/meals/by-date?date=2025-01-01", headers=self.auth_headers())

    # ---------- OPTIONAL LOAD TEST LOGIN ----------
    @task(1)
    def login_spam(self):
        self.client.post("/api/auth/login", json={
            "email": "andrii.client@macro.local",
            "password": "Test12345!"
        })