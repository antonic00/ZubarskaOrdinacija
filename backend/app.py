from datetime import timedelta
import datetime
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = 'postgresql://postgres:1234@localhost/Zubar'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
CORS(app)

app.app_context().push()

class Patients(db.Model):
    jmbg = db.Column(db.String(15), primary_key=True, unique=True)
    name = db.Column(db.String(20), nullable=False)
    lastname = db.Column(db.String(20), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    appointment_time = db.Column(db.DateTime, nullable=False)
    appointment_duration = db.Column(db.Integer, nullable=False)
    typeterms = db.Column(db.String(100), nullable=False)

    def __repr__(self):
        return f'Patient({self.jmbg}, {self.name}, {self.lastname}, {self.phone}, {self.email}, {self.appointment_time}, {self.appointment_duration}, {self.typeterms})'
    
    def __init__(self, jmbg, name, lastname, phone, email, appointment_time, appointment_duration, typeterms):
        self.jmbg = jmbg,
        self.name = name,
        self.lastname = lastname,
        self.phone = phone,
        self.email = email,
        self.appointment_time = appointment_time,
        self.appointment_duration = appointment_duration,
        self.typeterms = typeterms

def format_patient(self):
    return{
        "jmbg": self.jmbg,
        "name": self.name,
        "lastname": self.lastname,
        "phone": self.phone,
        "email": self.email,
        "appointment_time": self.appointment_time,
        "appointment_duration": self.appointment_duration,
        "typeterms" : self.typeterms
    }


@app.route('/')
def hello():
    return 'Hey!'

@app.route('/patients/daily', methods=['GET'])
def get_daily_appointments():
    
    now = datetime.datetime.now().date()
    current_day = now.strftime("%Y-%m-%d")

    patients = Patients.query.filter(Patients.appointment_time == current_day).all()
    patient_list = []
    for patient in patients:
        patient_list.append(format_patient(patient))
    return {'Daily Appointments': patient_list}

@app.route('/patients/weekly', methods=['GET'])
def get_weekly_appointments():

    now = datetime.datetime.now()
    
    start_of_week = now - datetime.timedelta(days=now.weekday())
    end_of_week = start_of_week + datetime.timedelta(days=6)
    
    start_of_week_str = start_of_week.strftime("%Y-%m-%d")
    end_of_week_str = end_of_week.strftime("%Y-%m-%d")
    
    patients = Patients.query.filter(Patients.appointment_time >= start_of_week_str,
                                     Patients.appointment_time <= end_of_week_str).all()
    patient_list = []
    for patient in patients:
        patient_list.append(format_patient(patient))
    return {'Weekly Appointments': patient_list}


@app.route('/patients', methods=['GET'])
def get_patients():
    patients = Patients.query.order_by(Patients.jmbg.asc()).all()
    patient_list = []
    for patient in patients:
        patient_list.append(format_patient(patient))
    return {'Patients' : patient_list}



@app.route('/patients/<string:jmbg>', methods = ['DELETE'])
def delete_patient(jmbg):
    patient = Patients.query.filter_by(jmbg=jmbg).first()
    if patient:
        db.session.delete(patient)
        db.session.commit()
        return f'Patient (jmbg: {jmbg}) deleted!'
    else:
        return f'Patient (jmbg: {jmbg}) not found!'


@app.route('/patients/<string:jmbg>', methods=['GET'])
def get_one_patient(jmbg):
    patient = Patients.query.filter_by(jmbg=jmbg).first()
    if patient:
        return {'Patients': [format_patient(patient)]}
    else:
        return {'message': 'Pacijent sa JMBG-om {} nije pronađen'.format(jmbg)}, 404


@app.route('/make_appointment', methods=["POST"])
def make_appointment():
    jmbg = request.json['jmbg']
    name = request.json['name']
    lastname = request.json['lastname']
    phone = request.json['phone']
    email = request.json['email']
    appointment_time = request.json['appointment_time']
    appointment_duration = int(request.json['appointment_duration'])
    typeterms = request.json['typeterms']

    # Provera slobodnosti termina
    existing_appointment = Patients.query.filter(
       Patients.appointment_time <= appointment_time,
        Patients.appointment_time + timedelta(minutes=appointment_duration) > appointment_time
    ).first()
    if existing_appointment:
        return "Termin je zauzet, molimo odaberite drugo vreme."

    new_patient = Patients(jmbg=jmbg, name=name, lastname=lastname, phone=phone, email=email,
                           appointment_time=appointment_time, appointment_duration=appointment_duration, typeterms=typeterms)
    db.session.add(new_patient)
    db.session.commit()

    return "Uspesno ste zakazali termin!"


@app.route('/cancel_appointment/<jmbg>', methods=["DELETE"])
def cancel_appointment(jmbg):
    patient = Patients.query.filter_by(jmbg=jmbg).first()
    if patient:
        db.session.delete(patient)
        db.session.commit()
        return "Uspešno ste otkazali termin."
    return "Pacijent sa tim JMBG nije pronađen."

class Dentists(db.Model):
    jmbg=db.Column(db.String(100), primary_key=True, unique=True)
    name=db.Column(db.String(100), nullable=False)
    lastname=db.Column(db.String(100), nullable=False)
    phone=db.Column(db.String(100), nullable=False)
    email=db.Column(db.String(100), nullable=False)

    def __repr__(self):
        return f"Dentist: {self.name+','+self.lastname+','+self.phone+','+self.email}"
    
    def __init__(self, jmbg, name, lastname, phone, email):
        self.jmbg = jmbg,
        self.name = name,
        self.lastname = lastname,
        self.phone = phone,
        self.email = email

def format_dentist(self):
        return{
            "jmbg": self.jmbg,
            "name": self.name,
            "lastname": self.lastname,
            "phone": self.phone,
            "email": self.email
        }
    
@app.route('/new_dentist', methods=["POST"])
def new_dentist():
    jmbg=request.json['jmbg']
    name=request.json['name']
    lastname=request.json['lastname']
    phone=request.json['phone']
    email=request.json['email']
    new_dentist = Dentists(jmbg, name, lastname, phone, email)
    db.session.add(new_dentist)
    db.session.commit()
    return format_dentist(new_dentist)

@app.route('/dentists', methods=['GET'])
def get_dentists():
    dentists = Dentists.query.order_by(Dentists.jmbg.asc()).all()
    dentist_list = []
    for dentist in dentists:
        dentist_list.append(format_dentist(dentist))
    return {'Dentists' : dentist_list}


@app.route('/view_calendar', methods=["GET"])
def view_calendar():
    # Dohvatanje svih zakazanih pacijenata
    appointments = Patients.query.all()
    
    # Kreiranje prazne liste u kojoj će se čuvati podaci o pacijentima
    appointments_data = []
    
    # Iteriranje kroz sve pacijente i čuvanje njihovih podataka u listi
    for appointment in appointments:
        appointment_data = {
            "jmbg": appointment.jmbg,
            "name": appointment.name,
            "lastname": appointment.lastname,
            "phone": appointment.phone,
            "email": appointment.email,
            "appointment_time": appointment.appointment_time,
            "appointment_duration": appointment.appointment_duration
        }
        appointments_data.append(appointment_data)
    
    # Vraćanje podataka o pacijentima u JSON formatu
    return jsonify(appointments_data)



if __name__ == '__main__':
    app.run(debug=True, port=5000)
    

