package Controlador.VistaBarbero;

import Controlador.InicioSesion.LoginC;
import Modelo.Barbero;
import Modelo.Conexiones.ConexionDB;
import Vistas.Barberos.*;
import Vistas.InicioSesion.Login;
import java.awt.Color;
import java.awt.Font;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;

public class BarberoC {

    private BarberoVistaDefault vista;
    private Barbero barbero;
    private int xMouse, yMouse;

    public BarberoC(BarberoVistaDefault vista, Barbero barbero) {
        this.vista = vista;
        this.barbero = barbero;
        configuracionVista();
        inicio();
    }

    public void iniciar() {
        vista.setVisible(true);
        vista.setLocationRelativeTo(null);
    }

    private void inicio() {
        PanelVerCitas vc = new PanelVerCitas();
        VerCitasC vcc = new VerCitasC(vc, barbero);
        vcc.iniciar(vista);
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


    private void btnIngresosMouseClicked(java.awt.event.MouseEvent e) {
        PanelIngresos pi = new PanelIngresos();
        IngresosC ingresosController = new IngresosC(pi, barbero);
        ingresosController.iniciar(vista);
        // Mostrar los ingresos al abrir el panel
    }

    public void titulo(String titulo) {
        String tituloMayus = titulo.toUpperCase();
        vista.titulo.setFont(new Font("Montserrat Black", Font.BOLD, 16));
        vista.titulo.setText("¡Hola " + tituloMayus + " Bienvenido a BarberEZ!");
    }

    private void btnVerCitasMouseClicked(java.awt.event.MouseEvent e) {
        inicio();
    }

    private void btnHistorialCitasMouseClicked(java.awt.event.MouseEvent e) {
        PanelHistorialCitas phc = new PanelHistorialCitas();
        HistorialCitasC hc = new HistorialCitasC(phc, barbero);
        hc.iniciar(vista);
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

    private void configuracionVista() {
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

        vista.btnHistorialCitas.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                btnHistorialCitasMouseClicked(e);
            }

        });

        vista.btnIngresos.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                btnIngresosMouseClicked(e);
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

        vista.btnIngresos.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                btnIngresosMouseClicked(e);
            }

        });

        vista.exitTxt.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                cerrarSesion();
            }

        });

        vista.btnIngresos.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseEntered(MouseEvent e) {
                vista.btnIngresos.setForeground(Color.BLACK);
            }

            @Override
            public void mouseExited(MouseEvent e) {
                vista.btnIngresos.setForeground(Color.white);
            }
        });
        vista.btnVerCitas.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseEntered(MouseEvent e) {
                vista.btnVerCitas.setForeground(Color.BLACK);
            }

            @Override
            public void mouseExited(MouseEvent e) {
                vista.btnVerCitas.setForeground(Color.white);
            }
        });

        vista.btnHistorialCitas.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseEntered(MouseEvent e) {
                vista.btnHistorialCitas.setForeground(Color.BLACK);
            }

            @Override
            public void mouseExited(MouseEvent e) {
                vista.btnHistorialCitas.setForeground(Color.white);
            }
        });

// Cerrar sesión con hover
        vista.lblCerrarSesion.addMouseListener(
                new MouseAdapter() {
                    @Override
                    public void mouseEntered(MouseEvent e
                    ) {
                        vista.lblCerrarSesion.setText("<html><u>Cerrar sesión</u></html>");
                        vista.lblCerrarSesion.setForeground(Color.BLACK);
                    }

                    @Override
                    public void mouseExited(MouseEvent e
                    ) {
                        vista.lblCerrarSesion.setText("Cerrar sesión");
                        vista.lblCerrarSesion.setForeground(Color.white);
                    }

                    @Override
                    public void mouseClicked(MouseEvent e
                    ) {
                        cerrarSesion();
                    }
                }
        );
        vista.exitBtn.addMouseListener(
                new MouseAdapter() {
                    @Override
                    public void mouseEntered(MouseEvent e
                    ) {
                        vista.exitBtn.setBackground(Color.red);
                        vista.exitTxt.setForeground(Color.white);
                    }

                    @Override
                    public void mouseExited(MouseEvent e
                    ) {
                        vista.exitBtn.setBackground(new Color(242, 242, 242));
                        vista.exitTxt.setForeground(Color.black);
                    }
                }
        );

        vista.exitTxt.addMouseListener(
                new MouseAdapter() {
                    @Override
                    public void mouseEntered(MouseEvent e
                    ) {
                        vista.exitBtn.setBackground(Color.red);
                        vista.exitTxt.setForeground(Color.white);
                    }

                    @Override
                    public void mouseExited(MouseEvent e
                    ) {
                        vista.exitBtn.setBackground(new Color(242, 242, 242));
                        vista.exitTxt.setForeground(Color.black);

                    }
                }
        );


    }
}