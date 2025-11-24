package Principal;

import Controlador.InicioSesion.LoginC;
import Observer.BarberoSubject;
import Observer.NotificationPoller;
import Vistas.InicioSesion.Login;

public class BarberEz {

    public static void main(String[] args) {
        Login lg = new Login();
        LoginC c = new LoginC(lg);
        c.iniciar();
    }
}
