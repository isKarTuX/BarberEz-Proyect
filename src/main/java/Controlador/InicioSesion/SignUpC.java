package Controlador.InicioSesion;

import Modelo.Conexiones.ConexionDB;
import Vistas.InicioSesion.SignUp;
import Vistas.InicioSesion.Login;
import java.awt.Color;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.swing.AbstractAction;
import javax.swing.JComponent;
import javax.swing.JOptionPane;
import javax.swing.KeyStroke;

public class SignUpC {

    private SignUp su;
    ConexionDB cx;
    private int xMouse, yMouse;

    public SignUpC(SignUp su) {
        this.su = su;
        configuracionVista();
    }

    public void iniciar() {

        su.setTitle("CREAR CUENTA");
        su.setVisible(true);
        su.setLocationRelativeTo(null);
        su.ocultar.setVisible(true);
        su.ver.setVisible(false);
        su.ocultar2.setVisible(true);
        su.ver2.setVisible(false);

    }

    private void headerMousePressed(java.awt.event.MouseEvent evt) {
        xMouse = evt.getX();
        yMouse = evt.getY();
    }

    private void headerMouseDragged(java.awt.event.MouseEvent evt) {
        int x = evt.getXOnScreen();
        int y = evt.getYOnScreen();
        su.setLocation(x - xMouse, y - yMouse);
    }

    private void exitTxtMouseClicked(java.awt.event.MouseEvent e) {
        su.setVisible(false);
        su.dispose();
        Login loginVista = new Login();
        LoginC lg = new LoginC(loginVista);
        lg.iniciar();
    }

    private void ocultarMouseClicked(java.awt.event.MouseEvent e) {
        su.ocultar.setVisible(false);
        su.ver.setVisible(true);
        su.passTxt.setEchoChar((char) 0);
    }

    private void verMouseClicked(java.awt.event.MouseEvent e) {
        su.ver.setVisible(false);
        su.ocultar.setVisible(true);
        su.passTxt.setEchoChar('●');
    }

    private void ocultar2MouseClicked(java.awt.event.MouseEvent e) {
        su.ocultar2.setVisible(false);
        su.ver2.setVisible(true);
        su.ConfirmedTxt.setEchoChar((char) 0);
    }

    private void ver2MouseClicked(java.awt.event.MouseEvent e) {
        su.ver2.setVisible(false);
        su.ocultar2.setVisible(true);
        su.ConfirmedTxt.setEchoChar('●');
    }

    private void SignUpActionPerformed() {
        ConexionDB cx = ConexionDB.getInstance();

        // Verificar conexión (ahora getConnection() puede lanzar SQLException)
        try {
            Connection testConn = cx.getConnection();
            testConn.close(); // Cerrar conexión de prueba
        } catch (SQLException e) {
            JOptionPane.showMessageDialog(null, "Error de conexión a la base de datos: " + e.getMessage());
            return;
        }

        try {
            String nombreUsuario = su.userTxt.getText();
            String contraseña = String.valueOf(su.passTxt.getPassword());
            String confirmacion = String.valueOf(su.ConfirmedTxt.getPassword());

            if (confirmacion.equals(contraseña)) {
                // Usar el procedimiento almacenado sp_registrar_usuario
                // Nota: Como no tienes campos para correo, telefono y cedula en el formulario,
                // usaremos valores predeterminados o el nombre de usuario como correo
                String correo = nombreUsuario + "@barberez.com";
                String telefono = "0000000000";
                String cedula = "TEMP" + System.currentTimeMillis(); // Temporal único

                String query = "CALL sp_registrar_usuario(?, ?, ?, ?, ?, ?, ?)";
                CallableStatement cs = cx.getConnection().prepareCall(query);
                cs.setString(1, nombreUsuario);  // nombre
                cs.setString(2, correo);          // correo
                cs.setString(3, telefono);        // telefono
                cs.setString(4, contraseña);      // contrasena
                cs.setString(5, cedula);          // cedula
                cs.setString(6, "cliente");       // rol
                cs.setDouble(7, 0.00);            // comision (0 para clientes)

                cs.execute();

                JOptionPane.showMessageDialog(null, "Cuenta creada exitosamente");
                Login lg = new Login();
                LoginC C = new LoginC(lg);
                C.iniciar();
                su.dispose();
            } else {
                JOptionPane.showMessageDialog(null, "Las contraseñas no coinciden, ¡corrígelo!");
            }

        } catch (SQLException ex) {
            Logger.getLogger(Login.class.getName()).log(Level.SEVERE, null, ex);
            JOptionPane.showMessageDialog(null, "Error al crear la cuenta: " + ex.getMessage());
        }
    }

    public void configuracionVista() {
        su.ocultar.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                ocultarMouseClicked(e);
            }

        });

        su.ver.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                verMouseClicked(e);
            }

        });

        su.ocultar2.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                ocultar2MouseClicked(e);
            }

        });

        su.ver2.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                ver2MouseClicked(e);
            }
        });

        su.SignUpBtnTxt.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                SignUpActionPerformed();
            }

        });

        su.exitTxt.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                exitTxtMouseClicked(e);
            }

        });

        su.passTxt.addFocusListener(new java.awt.event.FocusListener() {
            @Override
            public void focusGained(java.awt.event.FocusEvent evt) {
                if (String.valueOf(su.passTxt.getPassword()).equals("●●●●●●●●")) {
                    su.passTxt.setText("");
                    su.passTxt.setForeground(Color.black);
                }
            }

            @Override
            public void focusLost(java.awt.event.FocusEvent evt) {
                if (String.valueOf(su.passTxt.getPassword()).isEmpty()) {
                    su.passTxt.setText("●●●●●●●●");
                    su.passTxt.setForeground(Color.gray);
                }
            }
        });

        su.ConfirmedTxt.addFocusListener(new java.awt.event.FocusListener() {
            @Override
            public void focusGained(java.awt.event.FocusEvent evt) {
                if (String.valueOf(su.ConfirmedTxt.getPassword()).equals("●●●●●●●●")) {
                    su.ConfirmedTxt.setText("");
                    su.ConfirmedTxt.setForeground(Color.black);
                }
            }

            @Override
            public void focusLost(java.awt.event.FocusEvent evt) {
                if (String.valueOf(su.ConfirmedTxt.getPassword()).isEmpty()) {
                    su.ConfirmedTxt.setText("●●●●●●●●");
                    su.ConfirmedTxt.setForeground(Color.gray);
                }
            }
        });

        su.userTxt.addFocusListener(new java.awt.event.FocusListener() {
            @Override
            public void focusGained(java.awt.event.FocusEvent evt) {
                if (su.userTxt.getText().equals("Ingrese el nombre de usuario que tendrá")) {
                    su.userTxt.setText("");
                    su.userTxt.setForeground(Color.black);
                }
            }

            @Override
            public void focusLost(java.awt.event.FocusEvent evt) {
                if (su.userTxt.getText().isEmpty()) {
                    su.userTxt.setText("Ingrese el nombre de usuario que tendrá");
                    su.userTxt.setForeground(Color.gray);
                }
            }
        });

        su.header.addMouseListener(new MouseAdapter() {
            @Override
            public void mousePressed(MouseEvent evt) {
                headerMousePressed(evt);
            }

        });

        su.header.addMouseMotionListener(new MouseAdapter() {
            @Override
            public void mouseDragged(MouseEvent evt) {
                headerMouseDragged(evt);
            }
        });

        su.exitBtn.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseEntered(MouseEvent e) {
                su.exitBtn.setBackground(Color.red);
                su.exitTxt.setForeground(Color.white);
            }

            @Override
            public void mouseExited(MouseEvent e) {
                su.exitBtn.setBackground(Color.white);
                su.exitTxt.setForeground(Color.black);
            }
        });

        su.exitTxt.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseEntered(MouseEvent e) {
                su.exitBtn.setBackground(Color.red);
                su.exitTxt.setForeground(Color.white);
            }

            @Override
            public void mouseExited(MouseEvent e) {
                su.exitBtn.setBackground(Color.white);
                su.exitTxt.setForeground(Color.black);
            }
        });

        su.SignUpBtn.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseEntered(MouseEvent e) {
                su.SignUpBtn.setBackground(new Color(0, 156, 223));
                su.SignUpBtnTxt.setForeground(Color.white);
            }

            @Override
            public void mouseExited(MouseEvent e) {
                su.SignUpBtn.setBackground(Color.GRAY);
                su.SignUpBtnTxt.setForeground(Color.black);
            }
        });

        su.SignUpBtnTxt.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseEntered(MouseEvent e) {
                su.SignUpBtn.setBackground(new Color(0, 156, 223));
                su.SignUpBtnTxt.setForeground(Color.white);
            }

            @Override
            public void mouseExited(MouseEvent e) {
                su.SignUpBtn.setBackground(Color.GRAY);
                su.SignUpBtnTxt.setForeground(Color.black);
            }
        });

    }

    private void configurarAccionEnter() {
        su.getRootPane().getInputMap(JComponent.WHEN_IN_FOCUSED_WINDOW)
                .put(KeyStroke.getKeyStroke("ENTER"), "login");

        su.getRootPane().getActionMap().put("login", new AbstractAction() {
            @Override
            public void actionPerformed(java.awt.event.ActionEvent e) {
                SignUpActionPerformed();
            }
        });
    }
}
