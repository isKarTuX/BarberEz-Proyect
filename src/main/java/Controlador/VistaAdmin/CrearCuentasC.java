/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package Controlador.VistaAdmin;

import Modelo.Admin;
import Modelo.Conexiones.ConsultaDB;
import Vistas.Admin.*;
import Vistas.InicioSesion.Login;

import javax.swing.*;
import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;

/**
 *
 * @author andre
 */
public class CrearCuentasC {

    private PanelCrearCuentas pcc;
    private Admin admin;

    public CrearCuentasC(PanelCrearCuentas pcc, Admin admin) {
        this.pcc = pcc;
        this.admin = admin;
        configurarEventos();
    }

    public void iniciar(AdminVistaDefault vista) {
        pcc.setSize(690, 530);
        pcc.setLocation(0, 0);
        vista.contenido.removeAll();
        vista.contenido.add(pcc, BorderLayout.CENTER);
        vista.contenido.revalidate();
        vista.contenido.repaint();
    }
    private void ocultarMouseClicked(java.awt.event.MouseEvent e) {
        pcc.ocultar.setVisible(false);
        pcc.ver.setVisible(true);
        pcc.passTxt.setEchoChar((char) 0);
    }

    private void verMouseClicked(java.awt.event.MouseEvent e) {
        pcc.ver.setVisible(false);
        pcc.ocultar.setVisible(true);
        pcc.passTxt.setEchoChar('●');
    }
    private void configurarEventos() {

        pcc.jPanel1.setBackground(new Color(242, 242, 242));
        pcc.SignUpBtnTxt.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseClicked(java.awt.event.MouseEvent evt) {
                registrarCuenta();
            }
        });

        pcc.ocultar.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                ocultarMouseClicked(e);
            }

        });

        pcc.ver.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                verMouseClicked(e);
            }

        });

        pcc.passTxt.addFocusListener(new java.awt.event.FocusListener() {
            @Override
            public void focusGained(java.awt.event.FocusEvent evt) {
                if (String.valueOf(pcc.passTxt.getPassword()).equals("●●●●●●●●")) {
                    pcc.passTxt.setText("");
                    pcc.passTxt.setForeground(Color.black);
                }
            }

            @Override
            public void focusLost(java.awt.event.FocusEvent evt) {
                if (String.valueOf(pcc.passTxt.getPassword()).isEmpty()) {
                    pcc.passTxt.setText("●●●●●●●●");
                    pcc.passTxt.setForeground(Color.gray);
                }
            }
        });


        pcc.userTxt.addFocusListener(new java.awt.event.FocusListener() {
            @Override
            public void focusGained(java.awt.event.FocusEvent evt) {
                if (pcc.userTxt.getText().equals("Ingrese el nombre de usuario que tendrá")) {
                    pcc.userTxt.setText("");
                    pcc.userTxt.setForeground(Color.black);
                }
            }

            @Override
            public void focusLost(java.awt.event.FocusEvent evt) {
                if (pcc.userTxt.getText().isEmpty()) {
                    pcc.userTxt.setText("Ingrese el nombre de usuario que tendrá");
                    pcc.userTxt.setForeground(Color.gray);
                }
            }
        });
    }

    private void registrarCuenta() {
        String usuario = pcc.userTxt.getText().trim();
        String contrasena = new String(pcc.passTxt.getPassword()).trim();
        String rol = pcc.jComboBox1.getSelectedItem().toString();

        // Validación de campos
        if (usuario.isEmpty() || contrasena.isEmpty()) {
            JOptionPane.showMessageDialog(
                    pcc,
                    "Todos los campos son obligatorios.",
                    "Error",
                    JOptionPane.ERROR_MESSAGE
            );
            return;
        }

        // Uso de ConsultaDB para manejar el proceso en segundo plano
        ConsultaDB<Boolean> consultaDB = new ConsultaDB<>(
                null, // Parent JFrame
                () -> admin.crearCuenta(usuario, contrasena, rol), // Tarea en segundo plano
                new ConsultaDB.DatabaseTaskListener<>() {
                    @Override
                    public void onSuccess(Boolean exito) {
                        if (exito) {
                            JOptionPane.showMessageDialog(
                                    pcc,
                                    "Cuenta creada exitosamente.",
                                    "Éxito",
                                    JOptionPane.INFORMATION_MESSAGE
                            );
                        } else {
                            JOptionPane.showMessageDialog(
                                    pcc,
                                    "Error al crear la cuenta. Intente nuevamente.",
                                    "Error",
                                    JOptionPane.ERROR_MESSAGE
                            );
                        }
                    }

                    @Override
                    public void onError(Exception e) {
                        e.printStackTrace();
                        JOptionPane.showMessageDialog(
                                pcc,
                                "Error al crear la cuenta: " + e.getMessage(),
                                "Error",
                                JOptionPane.ERROR_MESSAGE
                        );
                    }
                }
        );

        // Ejecutar la tarea en segundo plano
        consultaDB.execute();
    }
}
