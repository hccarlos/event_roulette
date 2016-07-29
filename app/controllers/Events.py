"""
    Sample Controller File

    A Controller should be in charge of responding to a request.
    Load models to interact with the database and load views to render them to the client.

    Create a controller using this template
"""
from system.core.controller import *

class Events(Controller):
    def __init__(self, action):
        super(Events, self).__init__(action)
        self.load_model('User')
        self.db = self._app.db
   
    def index(self):
        return self.load_view('projecthome.html')
    def projectmain(self):
        return self.load_view('projectmain.html')

    def show_register_page(self):
        return self.load_view('project.html')

    def register(self):
        register_status = self.models['User'].register_user(request.form)
        if register_status['status'] == False:
            for message in register_status['errors']:
                flash(message)
            return redirect('/')   
        else:
            session['name'] = request.form['name']
            return redirect('/success')

    def login(self):
        user_info = {
                'email': request.form['email'],
                'password': request.form['password']
                    }
        user = self.models['Registration'].login_validation(user_info)
        if user:
            session['name'] = user[0]['name']
            return redirect('/success')
        else:
            flash('Email or password is incorrect. Please log-in again!')
            return redirect('/')

    def success(self):
        return self.load_view('projectmain.html')

    def update(self):
        return self.load_view('update.html')

    # def select_interests(self):
    #     event_info = {
    #         '105': request.form['art'],
    #         '110': request.form['food'],
    #         '104': request.form['film'],
    #         '103': request.form['music'],
    #         '102': request.form['science'],
    #         '109': request.form['travel'],
    #         '108': request.form['sports']
    #     }
    #     preferences = self.models['Event'].user_preference(event_info)
    #     return redirect('/success')

    def logout(self):
        session.clear()
        return redirect('/')