package Controlador.VistaCliente;

import Controlador.InicioSesion.LoginC;
import Modelo.Cliente;
import Modelo.Conexiones.ConexionDB;
import Modelo.Conexiones.ConsultaDB;
import Observer.BarberoSubject;
import Observer.BarberoObserver;
import Observer.NotificationPoller;
import Vistas.Clientes.ClienteVistaDefault;
import Vistas.Clientes.PanelAgendarCita;
import Vistas.Clientes.PanelVerCitas;
import Vistas.Clientes.PanelHistorialCitas;
import Vistas.InicioSesion.Login;

import javax.swing.*;
import java.awt.Color;
import java.awt.Font;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.util.List;

public class ClienteC implements BarberoObserver {

    private ClienteVistaDefault vista;
    private Cliente cliente;
    private int xMouse, yMouse;
    private BarberoSubject barberoSubject;

    public ClienteC(ClienteVistaDefault vista, Cliente cliente) {
        this.barberoSubject = new BarberoSubject();  // Inicializamos el sujeto
        this.vista = vista;
        this.cliente = cliente;
        configuracionVista();
        iniciarPoller();
    }

    private void iniciarPoller() {
        NotificationPoller poller = new NotificationPoller(barberoSubject);
        new Thread(() -> poller.pollNotifications()).start();
    }

    public void iniciar() {
        this.vista.setVisible(true);
        this.vista.setLocationRelativeTo(null);
        inicio();

    }

    private void exitTxtMouseClicked(java.awt.event.MouseEvent e) {
        cerrarSesion();
    }

    private void header2MousePressed(java.awt.event.MouseEvent evt) {
        xMouse = evt.getX();
        yMouse = evt.getY();
    }

    private void header2MouseDragged(java.awt.event.MouseEvent evt) {
        int x = evt.getXOnScreen();
        int y = evt.getYOnScreen();
        vista.setLocation(x - xMouse, y - yMouse);
    }

    private void inicio() {
        PanelAgendarCita agdc = new PanelAgendarCita();
        AgendarCitaC AC = new AgendarCitaC(agdc, cliente, barberoSubject);  // Agregar AgendarCitaC como observador
        AC.iniciar(vista);
        barberoSubject.addObserver(AC);
    }


    public void cerrarSesion() {
        vista.setVisible(false);
        vista.dispose();
        // Las conexiones ahora se cierran automáticamente con try-with-resources
        System.out.println("Sesión cerrada");
        Login loginVista = new Login();
        LoginC lg = new LoginC(loginVista);
        lg.iniciar();
    }

    private void btnAgendarCitaMouseClicked(java.awt.event.MouseEvent e) {
        inicio();
    }

    public void titulo(String titulo) {
        String tituloMayus = titulo.toUpperCase();
        vista.titulo.setFont(new Font("Montserrat Black", Font.BOLD, 16));
        vista.titulo.setText("¡Hola " + tituloMayus + " Bienvenido a BarberEZ!");
    }

    private void btnVerCitasMouseClicked(java.awt.event.MouseEvent e) {
        PanelVerCitas pvc = new PanelVerCitas();
        VerCitasC VC = new VerCitasC(pvc, cliente);
        VC.iniciar(vista);
    }

    private void btnHistorialCitasMouseClicked(java.awt.event.MouseEvent e) {
        PanelHistorialCitas phc = new PanelHistorialCitas();
        HistorialCitasC HC = new HistorialCitasC(phc, cliente);
        HC.iniciar(vista);
    }

    public void configuracionVista() {
        vista.btnAgendarCita.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                btnAgendarCitaMouseClicked(e);
            }
        });

        vista.btnVerCitas.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                btnVerCitasMouseClicked(e);
            }
        });

        vista.btnHistorialCitas.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                btnHistorialCitasMouseClicked(e);
            }
        });

        vista.exitTxt.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                exitTxtMouseClicked(e);
            }
        });

        vista.header2.addMouseListener(new MouseAdapter() {
            @Override
            public void mousePressed(MouseEvent evt) {
                header2MousePressed(evt);
            }
        });
        vista.header2.addMouseMotionListener(new MouseAdapter() {
            @Override
            public void mouseDragged(MouseEvent evt) {
                header2MouseDragged(evt);
            }
        });

        // Acciones de hover y cambio de cursor
        vista.btnAgendarCita.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseEntered(MouseEvent e) {
                vista.btnAgendarCita.setForeground(new Color(244, 98, 98));
            }

            @Override
            public void mouseExited(MouseEvent e) {
                vista.btnAgendarCita.setForeground(Color.white);
            }
        });

        vista.btnVerCitas.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseEntered(MouseEvent e) {
                vista.btnVerCitas.setForeground(new Color(244, 98, 98));
            }

            @Override
            public void mouseExited(MouseEvent e) {
                vista.btnVerCitas.setForeground(Color.white);
            }
        });

        vista.btnHistorialCitas.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseEntered(MouseEvent e) {
                vista.btnHistorialCitas.setForeground(new Color(244, 98, 98));
            }

            @Override
            public void mouseExited(MouseEvent e) {
                vista.btnHistorialCitas.setForeground(Color.white);
            }
        });

        // Cerrar sesión con hover
        vista.lblCerrarSesion.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseEntered(MouseEvent e) {
                vista.lblCerrarSesion.setText("<html><u>Cerrar sesión</u></html>");
                vista.lblCerrarSesion.setForeground(new Color(244, 98, 98));
            }

            @Override
            public void mouseExited(MouseEvent e) {
                vista.lblCerrarSesion.setText("Cerrar sesión");
                vista.lblCerrarSesion.setForeground(Color.white);
            }

            @Override
            public void mouseClicked(MouseEvent e) {
                cerrarSesion();
            }
        });
        vista.exitBtn.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseEntered(MouseEvent e) {
                vista.exitBtn.setBackground(Color.red);
                vista.exitTxt.setForeground(Color.white);
            }

            @Override
            public void mouseExited(MouseEvent e) {
                vista.exitBtn.setBackground(new Color(242, 242, 242));
                vista.exitTxt.setForeground(Color.black);
            }
        });

        vista.exitTxt.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseEntered(MouseEvent e) {
                vista.exitBtn.setBackground(Color.red);
                vista.exitTxt.setForeground(Color.white);
            }

            @Override
            public void mouseExited(MouseEvent e) {
                vista.exitBtn.setBackground(new Color(242, 242, 242));
                vista.exitTxt.setForeground(Color.black);
            }
        });
    }

    @Override
    public void update(List<String> listaDeBarberos) {
        // Mostrar la notificación más reciente
        String ultimaNotificacion = listaDeBarberos.get(listaDeBarberos.size() - 1);
        JOptionPane.showMessageDialog(vista, "Nueva notificación: " + ultimaNotificacion);

        // Si deseas actualizar componentes de UI, hazlo aquí
    }
}
