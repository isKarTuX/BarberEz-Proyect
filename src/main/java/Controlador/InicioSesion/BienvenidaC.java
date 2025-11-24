package Controlador.InicioSesion;

import Vistas.InicioSesion.Bienvenida;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import javax.swing.AbstractAction;
import javax.swing.JComponent;
import javax.swing.KeyStroke;

public class BienvenidaC {

    private Bienvenida B;
    private int xMouse, yMouse;

    public BienvenidaC(Bienvenida B) {
        this.B = B;
        configuracionVista();
        configurarAccionEnter();
    }

    public void Iniciar() {
        B.setVisible(true);
        B.setLocationRelativeTo(null);
        B.setTitle("Welcome");
    }

    public void moverVentana2(MouseEvent evt) {
        xMouse = evt.getX();
        yMouse = evt.getY();
    }

    public void moverVentana(MouseEvent evt) {
        int x = evt.getXOnScreen();
        int y = evt.getYOnScreen();
        B.setLocation(x - xMouse, y - yMouse);
    }

    public void entrar() {
        B.dispose();
    }

    public void configuracionVista() {
        B.botonEntrar.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                entrar();
            }
        });
        B.header.addMouseListener(new MouseAdapter() {
            @Override
            public void mousePressed(MouseEvent evt) {
                moverVentana2(evt);
            }
        });
        B.header.addMouseMotionListener(new MouseAdapter() {
            @Override
            public void mouseDragged(MouseEvent evt) {
                moverVentana(evt);
            }
        });

    }

    private void configurarAccionEnter() {
        B.getRootPane().getInputMap(JComponent.WHEN_IN_FOCUSED_WINDOW)
                .put(KeyStroke.getKeyStroke("ENTER"), "login");

        B.getRootPane().getActionMap().put("login", new AbstractAction() {
            @Override
            public void actionPerformed(java.awt.event.ActionEvent e) {
                entrar();
            }
        });
    }
}
