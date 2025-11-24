package Controlador.InicioSesion;

import Controlador.VistaAdmin.*;
import Controlador.VistaBarbero.BarberoC;
import Controlador.VistaCliente.ClienteC;
import Modelo.Admin;
import Modelo.Barbero;
import Modelo.Cliente;
import Modelo.Conexiones.ConsultaDB;
import Vistas.Clientes.ClienteVistaDefault;
import Vistas.InicioSesion.SignUp;
import Vistas.InicioSesion.Login;
import Vistas.InicioSesion.Bienvenida;
import Modelo.Conexiones.ConexionDB;
import Vistas.Admin.*;

import java.sql.*;
import java.awt.Color;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.swing.*;

import Vistas.Barberos.BarberoVistaDefault;

import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.awt.Font;
import java.awt.font.TextAttribute;
import java.util.Map;

public class LoginC {

    private Login lg;
    ConexionDB cx;
    private int xMouse, yMouse;

    public LoginC(Login lg) {
        this.lg = lg;
        ConfiguracionVista();
        configurarAccionEnter();
    }

    public void iniciar() {
        lg.setTitle("Menu de Inicio - BarberEz");
        lg.setVisible(true);
        lg.setLocationRelativeTo(null);
        lg.ocultar.setVisible(true);
        lg.ver.setVisible(false);
    }

    private void headerMousePressed(java.awt.event.MouseEvent evt) {
        xMouse = evt.getX();
        yMouse = evt.getY();
    }

    private void headerMouseDragged(java.awt.event.MouseEvent evt) {
        int x = evt.getXOnScreen();
        int y = evt.getYOnScreen();
        lg.setLocation(x - xMouse, y - yMouse);
    }

    private void exitTxtMouseClicked(java.awt.event.MouseEvent e) {
        System.exit(0);
    }

    private void ocultarMouseClicked(java.awt.event.MouseEvent e) {
        lg.ocultar.setVisible(false);
        lg.ver.setVisible(true);
        lg.passTxt.setEchoChar((char) 0);
    }

    private void verMouseClicked(java.awt.event.MouseEvent e) {
        lg.ver.setVisible(false);
        lg.ocultar.setVisible(true);
        lg.passTxt.setEchoChar('●');
    }

    private void LoginActionPerformed() {
        // Retrieve the username and password from the login form
        String nombreUsuario = lg.userTxt.getText();
        String contraseña = String.valueOf(lg.passTxt.getPassword());

        // Use a wrapper array to store the role (to bypass final/effectively final restrictions)
        final String[] rolWrapper = new String[1];
        final int[] idUsuarioWrapper = new int[1];

        // Define the database task using ConsultaDB
        ConsultaDB<Boolean> consultaDB = new ConsultaDB<>(
                lg,  // Pass the parent JFrame (login window)
                () -> {  // Define the task to execute
                    // Modificado para usar la nueva estructura de BD
                    String query = "SELECT idUsuario, nombre, rol FROM usuario WHERE (correo=? OR nombre=?) AND contrasena=?";
                    try (Connection cx = ConexionDB.getInstance().getConnection();
                         PreparedStatement ps = cx.prepareStatement(query)) {

                        ps.setString(1, nombreUsuario);
                        ps.setString(2, nombreUsuario);
                        ps.setString(3, contraseña);

                        try (ResultSet rs = ps.executeQuery()) {
                            if (rs.next()) {
                                idUsuarioWrapper[0] = rs.getInt("idUsuario");
                                rolWrapper[0] = rs.getString("rol");  // Store the user's role
                                return true;  // Login successful
                            } else {
                                return false;  // Login failed
                            }
                        }
                    }
                },
                new ConsultaDB.DatabaseTaskListener<>() {
                    @Override
                    public void onSuccess(Boolean loginSuccessful) {
                        if (loginSuccessful) {
                            // Navigate to the next interface based on the role
                            showBienvenida(nombreUsuario, contraseña, rolWrapper[0]);
                        } else {
                            JOptionPane.showMessageDialog(lg, "Usuario o contraseña incorrectos");
                        }
                    }

                    @Override
                    public void onError(Exception e) {
                        Logger.getLogger(Login.class.getName()).log(Level.SEVERE, null, e);
                        JOptionPane.showMessageDialog(lg, "Ocurrió un error durante el proceso de inicio de sesión.");
                    }
                }
        );

        // Execute the task
        consultaDB.execute();
    }



    private void showBienvenida(String nombreUsuario, String contraseña, String rol) {
        Bienvenida bienvenida = new Bienvenida();
        BienvenidaC bienvenidaController = new BienvenidaC(bienvenida);
        bienvenidaController.Iniciar();
        String nombreUsuarioMayus = nombreUsuario.toUpperCase();

        Font font = new Font("Montserrat Black", Font.BOLD, 16);
        Map<TextAttribute, Object> attributes = (Map<TextAttribute, Object>) font.getAttributes();
        attributes.put(TextAttribute.TRACKING, 0.2);
        font = font.deriveFont(attributes);

        bienvenida.nombreTxt.setFont(font);
        bienvenida.nombreTxt.setForeground(new Color(221, 221, 221));
        bienvenida.nombreTxt.setText(nombreUsuarioMayus);

        bienvenida.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        bienvenida.addWindowListener(new java.awt.event.WindowAdapter() {
            @Override
            public void windowClosed(java.awt.event.WindowEvent windowEvent) {
                switch (rol) {
                    case "cliente":
                        Cliente cliente = new Cliente(nombreUsuario, contraseña);
                        ClienteVistaDefault c = new ClienteVistaDefault();
                        ClienteC CC = new ClienteC(c, cliente);
                        CC.titulo(nombreUsuario);
                        CC.iniciar();
                        lg.dispose();
                        break;
                    case "admin":
                        Admin admin = new Admin(nombreUsuario, contraseña);
                        AdminVistaDefault AV = new AdminVistaDefault();
                        AdminC AC = new AdminC(AV, admin);
                        AC.iniciar();
                        AC.titulo(nombreUsuario);
                        lg.dispose();
                        break;
                    case "barbero":
                        BarberoVistaDefault b = new BarberoVistaDefault();
                        Barbero barbero = new Barbero(nombreUsuario, contraseña);
                        BarberoC bc = new BarberoC(b, barbero);
                        bc.titulo(nombreUsuario);
                        bc.iniciar();
                        lg.dispose();
                        break;
                }
            }
        });
    }



    private void SignUpActionPerformed(java.awt.event.MouseEvent e) {
        SignUp sn = new SignUp();
        SignUpC s = new SignUpC(sn);
        s.iniciar();
        lg.dispose();
    }

    private void ConfiguracionVista() {
        lg.ocultar.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                ocultarMouseClicked(e);
            }

        });

        lg.ver.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                verMouseClicked(e);
            }

        });

        lg.loginBtnTxt.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                LoginActionPerformed();
            }
        });

        lg.SignUpBtnTxt.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                SignUpActionPerformed(e);
            }

        });

        lg.exitTxt.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                exitTxtMouseClicked(e);
            }

        });

// Configuración para el campo de contraseña
        lg.passTxt.addFocusListener(new java.awt.event.FocusListener() {
            @Override
            public void focusGained(java.awt.event.FocusEvent evt) {
                if (String.valueOf(lg.passTxt.getPassword()).equals("●●●●●●●●")) {
                    lg.passTxt.setText("");
                    lg.passTxt.setForeground(Color.black);
                }
            }

            @Override
            public void focusLost(java.awt.event.FocusEvent evt) {
                if (String.valueOf(lg.passTxt.getPassword()).isEmpty()) {
                    lg.passTxt.setText("●●●●●●●●");
                    lg.passTxt.setForeground(Color.gray);
                }
            }
        });

// Configuración para el campo de usuario
        lg.userTxt.addFocusListener(new java.awt.event.FocusListener() {
            @Override
            public void focusGained(java.awt.event.FocusEvent evt) {
                if (lg.userTxt.getText().equals("Ingrese su nombre de usuario")) {
                    lg.userTxt.setText("");
                    lg.userTxt.setForeground(Color.black);
                }
            }

            @Override
            public void focusLost(java.awt.event.FocusEvent evt) {
                if (lg.userTxt.getText().isEmpty()) {
                    lg.userTxt.setText("Ingrese su nombre de usuario");
                    lg.userTxt.setForeground(Color.gray);
                }
            }
        });

        lg.header.addMouseListener(new MouseAdapter() {
            @Override
            public void mousePressed(MouseEvent evt) {
                headerMousePressed(evt);
            }

        });

        lg.header.addMouseMotionListener(new MouseAdapter() {
            @Override
            public void mouseDragged(MouseEvent evt) {
                headerMouseDragged(evt);
            }

        });

        lg.exitBtn.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseEntered(MouseEvent e) {
                lg.exitBtn.setBackground(Color.red);
                lg.exitTxt.setForeground(Color.white);
            }

            @Override
            public void mouseExited(MouseEvent e) {
                lg.exitBtn.setBackground(Color.white);
                lg.exitTxt.setForeground(Color.black);
            }
        });

        lg.exitTxt.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseEntered(MouseEvent e) {
                lg.exitBtn.setBackground(Color.red);
                lg.exitTxt.setForeground(Color.white);
            }

            @Override
            public void mouseExited(MouseEvent e) {
                lg.exitBtn.setBackground(Color.white);
                lg.exitTxt.setForeground(Color.black);
            }
        });

        lg.loginBtn.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseEntered(MouseEvent e) {
                lg.loginBtn.setBackground(new Color(3, 96, 231));
                lg.loginBtnTxt.setForeground(Color.white);
            }

            @Override
            public void mouseExited(MouseEvent e) {
                lg.loginBtn.setBackground(new Color(252, 64, 53));
                lg.loginBtnTxt.setForeground(Color.white);
            }
        });

        lg.loginBtnTxt.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseEntered(MouseEvent e) {
                lg.loginBtn.setBackground(new Color(3, 96, 231));
                lg.loginBtnTxt.setForeground(Color.white);
            }

            @Override
            public void mouseExited(MouseEvent e) {
                lg.loginBtn.setBackground(new Color(252, 64, 53));
                lg.loginBtnTxt.setForeground(Color.white);
            }
        });

        lg.SignUpBtn.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseEntered(MouseEvent e) {
                lg.SignUpBtn.setBackground(new Color(252, 64, 53));
                lg.SignUpBtnTxt.setForeground(Color.white);
            }

            @Override
            public void mouseExited(MouseEvent e) {
                lg.SignUpBtn.setBackground(new Color(3, 96, 231));
                lg.SignUpBtnTxt.setForeground(Color.black);
            }
        });

        lg.SignUpBtnTxt.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseEntered(MouseEvent e) {
                lg.SignUpBtn.setBackground(new Color(252, 64, 53));
                lg.SignUpBtnTxt.setForeground(Color.white);
            }

            @Override
            public void mouseExited(MouseEvent e) {
                lg.SignUpBtn.setBackground(new Color(3, 96, 231));
                lg.SignUpBtnTxt.setForeground(Color.white);
            }
        });
    }

    private void configurarAccionEnter() {
        lg.getRootPane().getInputMap(JComponent.WHEN_IN_FOCUSED_WINDOW)
                .put(KeyStroke.getKeyStroke("ENTER"), "login");

        lg.getRootPane().getActionMap().put("login", new AbstractAction() {
            @Override
            public void actionPerformed(java.awt.event.ActionEvent e) {
                LoginActionPerformed();
            }
        });
    }
}
