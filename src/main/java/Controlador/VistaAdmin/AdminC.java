// Controlador principal de Admin
package Controlador.VistaAdmin;

import Controlador.InicioSesion.LoginC;
import Modelo.Admin;
import Modelo.Conexiones.ConexionDB;
import Vistas.Admin.*;
import Vistas.InicioSesion.Login;

import java.awt.Color;
import java.awt.Font;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;

public class AdminC {

    private AdminVistaDefault vista;
    private Admin admin;
    private int xMouse, yMouse;

    public AdminC(AdminVistaDefault vista, Admin admin) {
        this.vista = vista;
        this.admin = admin;
        configuracionVista();
        mostrarPanel("verIngresos");
    }

    public void iniciar() {
        vista.setVisible(true);
        vista.setLocationRelativeTo(null);

    }

    public void titulo(String nombreUsuario) {
        vista.titulo.setText("Bienvenido, " + nombreUsuario);
    }

    private void mostrarPanel(String panel) {
        switch (panel) {
            case "crearCuentas":
                PanelCrearCuentas pcc = new PanelCrearCuentas();
                new CrearCuentasC(pcc, admin).iniciar(vista);
                break;
            case "historialCitas":
                PanelHistorialCitas phc = new PanelHistorialCitas();
                new HistorialCitasC(phc, admin).iniciar(vista);
                break;
            case "verIngresos":
                PanelVerIngresos pvi = new PanelVerIngresos();
                new VerIngresosC(pvi, admin).iniciar(vista);
                break;
        }
    }

    private void headerMousePressed(java.awt.event.MouseEvent evt) {
        xMouse = evt.getX();
        yMouse = evt.getY();
    }

    private void headerMouseDragged(java.awt.event.MouseEvent evt) {
        int x = evt.getXOnScreen();
        int y = evt.getYOnScreen();
        vista.setLocation(x - xMouse, y - yMouse);
    }

    private void configuracionVista() {
        vista.btnAgregarCuentas.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                mostrarPanel("crearCuentas");
            }
        });
        vista.btnHistorialCitas.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                mostrarPanel("historialCitas");
            }
        });
        vista.btnIngresos.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                mostrarPanel("verIngresos");
            }
        });
        vista.exitTxt.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                cerrarSesion();
            }
        });
        vista.header2.addMouseListener(new MouseAdapter() {
            @Override
            public void mousePressed(MouseEvent evt) {
                headerMousePressed(evt);
            }
        });
        vista.header2.addMouseMotionListener(new MouseAdapter() {
            @Override
            public void mouseDragged(MouseEvent evt) {
                headerMouseDragged(evt);
            }
        });
        vista.btnIngresos.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseEntered(MouseEvent e) {
                vista.btnIngresos.setForeground(Color.black);
            }

            @Override
            public void mouseExited(MouseEvent e) {
                vista.btnIngresos.setForeground(Color.white);
            }
        });

        vista.btnAgregarCuentas.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseEntered(MouseEvent e) {
                vista.btnAgregarCuentas.setForeground(Color.black);
            }

            @Override
            public void mouseExited(MouseEvent e) {
                vista.btnAgregarCuentas.setForeground(Color.white);
            }
        });

        vista.btnHistorialCitas.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseEntered(MouseEvent e) {
                vista.btnHistorialCitas.setForeground(Color.black);
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
                vista.lblCerrarSesion.setForeground(Color.black);
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

    public void cerrarSesion() {
        vista.setVisible(false);
        vista.dispose();
        // Las conexiones ahora se cierran automáticamente con try-with-resources
        System.out.println("Sesión cerrada");
        Login loginVista = new Login();
        new LoginC(loginVista).iniciar();
    }
}
