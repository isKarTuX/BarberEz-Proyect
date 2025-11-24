package Vistas.Barberos;

import Vistas.Clientes.*;
import java.awt.BorderLayout;


public class BarberoVistaDefault extends javax.swing.JFrame {

    
    public BarberoVistaDefault() {
        initComponents();
    }


    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        jScrollPane1 = new javax.swing.JScrollPane();
        jEditorPane1 = new javax.swing.JEditorPane();
        bg = new javax.swing.JPanel();
        jPanel1 = new javax.swing.JPanel();
        contenido = new javax.swing.JPanel();
        jSeparator1 = new javax.swing.JSeparator();
        header = new javax.swing.JPanel();
        titulo = new javax.swing.JLabel();
        exitBtn = new javax.swing.JPanel();
        exitTxt = new javax.swing.JLabel();
        header2 = new javax.swing.JPanel();
        logo = new javax.swing.JLabel();
        lblCerrarSesion = new javax.swing.JLabel();
        btnVerCitas = new javax.swing.JLabel();
        btnHistorialCitas = new javax.swing.JLabel();
        btnIngresos = new javax.swing.JLabel();

        jScrollPane1.setViewportView(jEditorPane1);

        setDefaultCloseOperation(javax.swing.WindowConstants.EXIT_ON_CLOSE);
        setLocationByPlatform(true);
        setUndecorated(true);
        setResizable(false);
        getContentPane().setLayout(new org.netbeans.lib.awtextra.AbsoluteLayout());

        bg.setLayout(new org.netbeans.lib.awtextra.AbsoluteLayout());

        jPanel1.setBackground(new java.awt.Color(0, 102, 102));
        jPanel1.setLayout(new org.netbeans.lib.awtextra.AbsoluteLayout());

        javax.swing.GroupLayout contenidoLayout = new javax.swing.GroupLayout(contenido);
        contenido.setLayout(contenidoLayout);
        contenidoLayout.setHorizontalGroup(
            contenidoLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGap(0, 690, Short.MAX_VALUE)
        );
        contenidoLayout.setVerticalGroup(
            contenidoLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGap(0, 530, Short.MAX_VALUE)
        );

        jPanel1.add(contenido, new org.netbeans.lib.awtextra.AbsoluteConstraints(190, 90, 690, -1));
        jPanel1.add(jSeparator1, new org.netbeans.lib.awtextra.AbsoluteConstraints(0, 170, 190, 11));

        header.setLayout(new org.netbeans.lib.awtextra.AbsoluteLayout());

        titulo.setFont(new java.awt.Font("Segoe UI Emoji", 1, 14)); // NOI18N
        titulo.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        header.add(titulo, new org.netbeans.lib.awtextra.AbsoluteConstraints(110, 20, 480, 50));

        exitTxt.setFont(new java.awt.Font("Roboto Light", 0, 24)); // NOI18N
        exitTxt.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        exitTxt.setText("X");
        exitTxt.setCursor(new java.awt.Cursor(java.awt.Cursor.HAND_CURSOR));
        exitTxt.setPreferredSize(new java.awt.Dimension(40, 40));
        exitTxt.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseClicked(java.awt.event.MouseEvent evt) {
                exitTxtMouseClicked(evt);
            }
            public void mouseEntered(java.awt.event.MouseEvent evt) {
                exitTxtMouseEntered(evt);
            }
            public void mouseExited(java.awt.event.MouseEvent evt) {
                exitTxtMouseExited(evt);
            }
        });

        javax.swing.GroupLayout exitBtnLayout = new javax.swing.GroupLayout(exitBtn);
        exitBtn.setLayout(exitBtnLayout);
        exitBtnLayout.setHorizontalGroup(
            exitBtnLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(exitBtnLayout.createSequentialGroup()
                .addContainerGap()
                .addComponent(exitTxt, javax.swing.GroupLayout.DEFAULT_SIZE, 38, Short.MAX_VALUE)
                .addContainerGap())
        );
        exitBtnLayout.setVerticalGroup(
            exitBtnLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, exitBtnLayout.createSequentialGroup()
                .addGap(0, 0, Short.MAX_VALUE)
                .addComponent(exitTxt, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
        );

        header.add(exitBtn, new org.netbeans.lib.awtextra.AbsoluteConstraints(642, 0, 50, -1));

        jPanel1.add(header, new org.netbeans.lib.awtextra.AbsoluteConstraints(190, 0, 690, 90));

        header2.setOpaque(false);

        javax.swing.GroupLayout header2Layout = new javax.swing.GroupLayout(header2);
        header2.setLayout(header2Layout);
        header2Layout.setHorizontalGroup(
            header2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGap(0, 880, Short.MAX_VALUE)
        );
        header2Layout.setVerticalGroup(
            header2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGap(0, 70, Short.MAX_VALUE)
        );

        jPanel1.add(header2, new org.netbeans.lib.awtextra.AbsoluteConstraints(0, 0, 880, 70));

        logo.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        logo.setIcon(new javax.swing.ImageIcon("src\\main\\java\\Imagenes\\logo_letra.png"));
        logo.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseClicked(java.awt.event.MouseEvent evt) {
                logoMouseClicked(evt);
            }
        });
        jPanel1.add(logo, new org.netbeans.lib.awtextra.AbsoluteConstraints(20, 10, 150, 155));

        lblCerrarSesion.setFont(new java.awt.Font("Myriad Pro", 3, 14)); // NOI18N
        lblCerrarSesion.setForeground(new java.awt.Color(255, 255, 255));
        lblCerrarSesion.setText("Cerrar Sesion");
        lblCerrarSesion.setCursor(new java.awt.Cursor(java.awt.Cursor.HAND_CURSOR));
        jPanel1.add(lblCerrarSesion, new org.netbeans.lib.awtextra.AbsoluteConstraints(50, 590, -1, -1));

        btnVerCitas.setFont(new java.awt.Font("Montserrat ExtraBold", 1, 14)); // NOI18N
        btnVerCitas.setForeground(new java.awt.Color(255, 255, 255));
        btnVerCitas.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        btnVerCitas.setIcon(new javax.swing.ImageIcon( "src\\main\\java\\Imagenes\\Cliente\\verCitas.png"));
        btnVerCitas.setText("Ver Citas");
        btnVerCitas.setCursor(new java.awt.Cursor(java.awt.Cursor.HAND_CURSOR));
        jPanel1.add(btnVerCitas, new org.netbeans.lib.awtextra.AbsoluteConstraints(0, 220, 180, 70));

        btnHistorialCitas.setFont(new java.awt.Font("Montserrat ExtraBold", 1, 14)); // NOI18N
        btnHistorialCitas.setForeground(new java.awt.Color(255, 255, 255));
        btnHistorialCitas.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        btnHistorialCitas.setIcon(new javax.swing.ImageIcon( "src\\main\\java\\Imagenes\\Cliente\\historial.png"));
        btnHistorialCitas.setText("Historial de Citas");
        btnHistorialCitas.setCursor(new java.awt.Cursor(java.awt.Cursor.HAND_CURSOR));
        jPanel1.add(btnHistorialCitas, new org.netbeans.lib.awtextra.AbsoluteConstraints(0, 300, 180, 70));

        btnIngresos.setFont(new java.awt.Font("Montserrat ExtraBold", 1, 14)); // NOI18N
        btnIngresos.setForeground(new java.awt.Color(255, 255, 255));
        btnIngresos.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        btnIngresos.setIcon(new javax.swing.ImageIcon( "src\\main\\java\\Imagenes\\Barberos\\ingresos.png"));
        btnIngresos.setText("Ingresos");
        btnIngresos.setCursor(new java.awt.Cursor(java.awt.Cursor.HAND_CURSOR));
        jPanel1.add(btnIngresos, new org.netbeans.lib.awtextra.AbsoluteConstraints(0, 380, 180, 70));

        bg.add(jPanel1, new org.netbeans.lib.awtextra.AbsoluteConstraints(0, 0, 880, -1));

        getContentPane().add(bg, new org.netbeans.lib.awtextra.AbsoluteConstraints(0, 0, -1, -1));

        pack();
    }// </editor-fold>//GEN-END:initComponents

    private void logoMouseClicked(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_logoMouseClicked

    }//GEN-LAST:event_logoMouseClicked

    private void exitTxtMouseClicked(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_exitTxtMouseClicked

    }//GEN-LAST:event_exitTxtMouseClicked

    private void exitTxtMouseEntered(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_exitTxtMouseEntered

    }//GEN-LAST:event_exitTxtMouseEntered

    private void exitTxtMouseExited(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_exitTxtMouseExited

    }//GEN-LAST:event_exitTxtMouseExited

    /**
     * @param args the command line arguments
     */
    public static void main(String args[]) {
        /* Set the Nimbus look and feel */
        //<editor-fold defaultstate="collapsed" desc=" Look and feel setting code (optional) ">
        /* If Nimbus (introduced in Java SE 6) is not available, stay with the default look and feel.
         * For details see http://download.oracle.com/javase/tutorial/uiswing/lookandfeel/plaf.html 
         */
        try {
            for (javax.swing.UIManager.LookAndFeelInfo info : javax.swing.UIManager.getInstalledLookAndFeels()) {
                if ("Nimbus".equals(info.getName())) {
                    javax.swing.UIManager.setLookAndFeel(info.getClassName());
                    break;
                }
            }
        } catch (ClassNotFoundException ex) {
            java.util.logging.Logger.getLogger(BarberoVistaDefault.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (InstantiationException ex) {
            java.util.logging.Logger.getLogger(BarberoVistaDefault.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (IllegalAccessException ex) {
            java.util.logging.Logger.getLogger(BarberoVistaDefault.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (javax.swing.UnsupportedLookAndFeelException ex) {
            java.util.logging.Logger.getLogger(BarberoVistaDefault.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        }
        //</editor-fold>
        //</editor-fold>
        //</editor-fold>
        //</editor-fold>

        /* Create and display the form */
        java.awt.EventQueue.invokeLater(new Runnable() {
            public void run() {
                new BarberoVistaDefault().setVisible(true);
            }
        });
    }

    // Variables declaration - do not modify//GEN-BEGIN:variables
    public javax.swing.JPanel bg;
    public javax.swing.JLabel btnHistorialCitas;
    public javax.swing.JLabel btnIngresos;
    public javax.swing.JLabel btnVerCitas;
    public javax.swing.JPanel contenido;
    public javax.swing.JPanel exitBtn;
    public javax.swing.JLabel exitTxt;
    public javax.swing.JPanel header;
    public javax.swing.JPanel header2;
    public javax.swing.JEditorPane jEditorPane1;
    public javax.swing.JPanel jPanel1;
    public javax.swing.JScrollPane jScrollPane1;
    public javax.swing.JSeparator jSeparator1;
    public javax.swing.JLabel lblCerrarSesion;
    public javax.swing.JLabel logo;
    public javax.swing.JLabel titulo;
    // End of variables declaration//GEN-END:variables
}
