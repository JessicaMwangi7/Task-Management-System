# TaskFlow Backend

## Setup

```bash
python -m venv venv
source venv/bin/activate    # Windows: venv\Scripts\activate
pip install -r requirements.txt
flask db init
flask db migrate -m "Initial"
flask db upgrade
flask run
