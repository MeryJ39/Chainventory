from locust import HttpUser, TaskSet, task, between 

class MyTaskSet(TaskSet):
    @task
    def my_task(self):
        self.client.get("/")
        
class ejemplo(HttpUser):
    wait_time = between(1, 3)
    host = "https://localhost:5173"
    
    tasks = [MyTaskSet]
    

