/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/GUIForms/JPanel.java to edit this template
 */
package Vistas.Clientes;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * @author Keyner
 */
public class PanelAgendarCita extends javax.swing.JPanel {

    public PanelAgendarCita() {
        initComponents();
    }

    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        jPanel1 = new javax.swing.JPanel();
        BG = new javax.swing.JPanel();
        jPanel2 = new javax.swing.JPanel();
        jLabel1 = new javax.swing.JLabel();
        jCalendar1 = new com.toedter.calendar.JCalendar();
        jLabel3 = new javax.swing.JLabel();
        jSeparator1 = new javax.swing.JSeparator();
        jLabel4 = new javax.swing.JLabel();
        jButton1 = new javax.swing.JButton();
        jLabel2 = new javax.swing.JLabel();
        jLabel5 = new javax.swing.JLabel();
        jSeparator2 = new javax.swing.JSeparator();
        jLabel6 = new javax.swing.JLabel();
        jButton2 = new javax.swing.JButton();
        jButton3 = new javax.swing.JButton();
        buttonGroup1 = new javax.swing.ButtonGroup();
        BG1 = new javax.swing.JPanel();
        jPanel4 = new javax.swing.JPanel();
        Titulo1 = new javax.swing.JLabel();
        jCalendar2 = new com.toedter.calendar.JCalendar();
        Subtitulo1 = new javax.swing.JLabel();
        jSeparator3 = new javax.swing.JSeparator();
        txtMostrarFecha = new javax.swing.JLabel();
        jButtonGuardarFecha = new javax.swing.JButton();
        Titulo = new javax.swing.JLabel();
        jSeparator4 = new javax.swing.JSeparator();
        horatxt = new javax.swing.JLabel();
        jButtonRegistrarCita = new javax.swing.JButton();
        jButtonLimpiar = new javax.swing.JButton();
        horabox = new javax.swing.JComboBox<>();
        seleccionarbtxt = new javax.swing.JLabel();
        cortecheck = new javax.swing.JCheckBox();
        barbacheck = new javax.swing.JCheckBox();
        exfoliacioncheck = new javax.swing.JCheckBox();
        digitalcheck = new javax.swing.JCheckBox();
        efectivocheck = new javax.swing.JCheckBox();
        metodopagotxt = new javax.swing.JLabel();
        barberosBox = new javax.swing.JComboBox<>();

        jPanel1.setPreferredSize(new java.awt.Dimension(620, 457));

        BG.setPreferredSize(new java.awt.Dimension(620, 457));

        jPanel2.setForeground(new java.awt.Color(0, 102, 102));

        jLabel1.setText("Reserve su cita:");

        jLabel3.setText("Seleccione su fecha deseada:");

        jLabel4.setText("Fecha elegida:  {fecha elejida}");
        jLabel4.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(0, 0, 0)));

        jButton1.setText("Aceptar");
        jButton1.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jButton1ActionPerformed(evt);
            }
        });

        javax.swing.GroupLayout jPanel2Layout = new javax.swing.GroupLayout(jPanel2);
        jPanel2.setLayout(jPanel2Layout);
        jPanel2Layout.setHorizontalGroup(
            jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel2Layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jSeparator1, javax.swing.GroupLayout.PREFERRED_SIZE, 295, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jLabel3, javax.swing.GroupLayout.PREFERRED_SIZE, 164, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jCalendar1, javax.swing.GroupLayout.PREFERRED_SIZE, 286, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addGroup(jPanel2Layout.createSequentialGroup()
                        .addComponent(jLabel4, javax.swing.GroupLayout.PREFERRED_SIZE, 171, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addGap(18, 18, 18)
                        .addComponent(jButton1))
                    .addGroup(jPanel2Layout.createSequentialGroup()
                        .addGap(18, 18, 18)
                        .addComponent(jLabel1, javax.swing.GroupLayout.PREFERRED_SIZE, 219, javax.swing.GroupLayout.PREFERRED_SIZE)))
                .addContainerGap(23, Short.MAX_VALUE))
        );
        jPanel2Layout.setVerticalGroup(
            jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel2Layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(jLabel1, javax.swing.GroupLayout.PREFERRED_SIZE, 33, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jSeparator1, javax.swing.GroupLayout.PREFERRED_SIZE, 10, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(28, 28, 28)
                .addComponent(jLabel3)
                .addGap(23, 23, 23)
                .addComponent(jCalendar1, javax.swing.GroupLayout.PREFERRED_SIZE, 203, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(18, 18, 18)
                .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel4, javax.swing.GroupLayout.PREFERRED_SIZE, 49, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addComponent(jButton1))
                .addContainerGap(65, Short.MAX_VALUE))
        );

        jLabel2.setFont(new java.awt.Font("Segoe UI", 2, 14)); // NOI18N
        jLabel2.setText("Categoria:");

        jLabel5.setText("Corte de pelo");

        jLabel6.setText("Hora:");

        jButton2.setText("Registrar Cita");
        jButton2.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jButton2ActionPerformed(evt);
            }
        });

        jButton3.setText("Limpiar");

        javax.swing.GroupLayout BGLayout = new javax.swing.GroupLayout(BG);
        BG.setLayout(BGLayout);
        BGLayout.setHorizontalGroup(
            BGLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(BGLayout.createSequentialGroup()
                .addComponent(jPanel2, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGroup(BGLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(BGLayout.createSequentialGroup()
                        .addGroup(BGLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addGroup(BGLayout.createSequentialGroup()
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addComponent(jSeparator2))
                            .addGroup(BGLayout.createSequentialGroup()
                                .addGroup(BGLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addGroup(BGLayout.createSequentialGroup()
                                        .addGap(30, 30, 30)
                                        .addGroup(BGLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                            .addComponent(jLabel2, javax.swing.GroupLayout.PREFERRED_SIZE, 113, javax.swing.GroupLayout.PREFERRED_SIZE)
                                            .addComponent(jLabel5, javax.swing.GroupLayout.PREFERRED_SIZE, 163, javax.swing.GroupLayout.PREFERRED_SIZE)))
                                    .addGroup(BGLayout.createSequentialGroup()
                                        .addGap(33, 33, 33)
                                        .addComponent(jLabel6, javax.swing.GroupLayout.PREFERRED_SIZE, 97, javax.swing.GroupLayout.PREFERRED_SIZE)))
                                .addGap(0, 0, Short.MAX_VALUE)))
                        .addContainerGap())
                    .addGroup(BGLayout.createSequentialGroup()
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, 81, Short.MAX_VALUE)
                        .addComponent(jButton2)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                        .addComponent(jButton3)
                        .addGap(30, 30, 30))))
        );
        BGLayout.setVerticalGroup(
            BGLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(jPanel2, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
            .addGroup(BGLayout.createSequentialGroup()
                .addContainerGap()
                .addComponent(jLabel2, javax.swing.GroupLayout.PREFERRED_SIZE, 26, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(18, 18, 18)
                .addComponent(jLabel5, javax.swing.GroupLayout.PREFERRED_SIZE, 33, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jSeparator2, javax.swing.GroupLayout.PREFERRED_SIZE, 18, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(18, 18, 18)
                .addComponent(jLabel6, javax.swing.GroupLayout.PREFERRED_SIZE, 36, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addGroup(BGLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jButton2)
                    .addComponent(jButton3))
                .addGap(46, 46, 46))
        );

        javax.swing.GroupLayout jPanel1Layout = new javax.swing.GroupLayout(jPanel1);
        jPanel1.setLayout(jPanel1Layout);
        jPanel1Layout.setHorizontalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(BG, javax.swing.GroupLayout.Alignment.TRAILING, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
        );
        jPanel1Layout.setVerticalGroup(
            jPanel1Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(BG, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
        );

        BG1.setMinimumSize(new java.awt.Dimension(690, 530));
        BG1.setPreferredSize(new java.awt.Dimension(690, 530));
        BG1.setLayout(new org.netbeans.lib.awtextra.AbsoluteLayout());

        jPanel4.setBackground(new java.awt.Color(242, 242, 242));
        jPanel4.setForeground(new java.awt.Color(0, 102, 102));
        jPanel4.setLayout(new org.netbeans.lib.awtextra.AbsoluteLayout());

        Titulo1.setFont(new java.awt.Font("Segoe UI", 2, 14)); // NOI18N
        Titulo1.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        Titulo1.setText("Reserve su cita");
        jPanel4.add(Titulo1, new org.netbeans.lib.awtextra.AbsoluteConstraints(80, 20, 219, 33));
        jPanel4.add(jCalendar2, new org.netbeans.lib.awtextra.AbsoluteConstraints(40, 150, 320, 240));

        Subtitulo1.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        Subtitulo1.setText("Seleccione su fecha deseada:");
        jPanel4.add(Subtitulo1, new org.netbeans.lib.awtextra.AbsoluteConstraints(40, 120, 164, -1));
        jPanel4.add(jSeparator3, new org.netbeans.lib.awtextra.AbsoluteConstraints(90, 60, 190, 10));

        txtMostrarFecha.setText("Fecha elegida: ");
        txtMostrarFecha.setBorder(javax.swing.BorderFactory.createLineBorder(new java.awt.Color(0, 0, 0)));
        jPanel4.add(txtMostrarFecha, new org.netbeans.lib.awtextra.AbsoluteConstraints(60, 440, 171, 49));

        jButtonGuardarFecha.setText("Aceptar");
        jButtonGuardarFecha.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jButtonGuardarFechaActionPerformed(evt);
            }
        });
        jPanel4.add(jButtonGuardarFecha, new org.netbeans.lib.awtextra.AbsoluteConstraints(250, 440, 100, 50));

        BG1.add(jPanel4, new org.netbeans.lib.awtextra.AbsoluteConstraints(-20, 0, 390, 570));

        Titulo.setFont(new java.awt.Font("Segoe UI", 2, 14)); // NOI18N
        Titulo.setHorizontalAlignment(javax.swing.SwingConstants.CENTER);
        Titulo.setText("Categoria");
        BG1.add(Titulo, new org.netbeans.lib.awtextra.AbsoluteConstraints(470, 20, 113, 26));
        BG1.add(jSeparator4, new org.netbeans.lib.awtextra.AbsoluteConstraints(420, 50, 210, 10));

        horatxt.setText("Hora:");
        BG1.add(horatxt, new org.netbeans.lib.awtextra.AbsoluteConstraints(430, 260, 40, 36));

        jButtonRegistrarCita.setText("Registrar Cita");
        jButtonRegistrarCita.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jButtonRegistrarCitaActionPerformed(evt);
            }
        });
        BG1.add(jButtonRegistrarCita, new org.netbeans.lib.awtextra.AbsoluteConstraints(410, 440, 120, 50));

        jButtonLimpiar.setText("Limpiar");
        jButtonLimpiar.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jButtonLimpiarActionPerformed(evt);
            }
        });
        BG1.add(jButtonLimpiar, new org.netbeans.lib.awtextra.AbsoluteConstraints(540, 440, 100, 50));

        horabox.setModel(new javax.swing.DefaultComboBoxModel<>(new String[] { "Seleccionar", "8:00" }));
        BG1.add(horabox, new org.netbeans.lib.awtextra.AbsoluteConstraints(480, 260, 154, 36));

        seleccionarbtxt.setText("<html>Seleccionar  :<br>Barbero</html>");
        BG1.add(seleccionarbtxt, new org.netbeans.lib.awtextra.AbsoluteConstraints(420, 180, 130, 30));

        cortecheck.setFont(new java.awt.Font("Segoe UI", 0, 14)); // NOI18N
        cortecheck.setText("Corte de pelo");
        BG1.add(cortecheck, new org.netbeans.lib.awtextra.AbsoluteConstraints(420, 90, -1, -1));

        barbacheck.setFont(new java.awt.Font("Segoe UI", 0, 14)); // NOI18N
        barbacheck.setText("Barba");
        BG1.add(barbacheck, new org.netbeans.lib.awtextra.AbsoluteConstraints(540, 90, -1, -1));

        exfoliacioncheck.setFont(new java.awt.Font("Segoe UI", 0, 14)); // NOI18N
        exfoliacioncheck.setText("Exfoliación a vapor");
        BG1.add(exfoliacioncheck, new org.netbeans.lib.awtextra.AbsoluteConstraints(420, 120, -1, -1));

        buttonGroup1.add(digitalcheck);
        digitalcheck.setFont(new java.awt.Font("Segoe UI", 0, 14)); // NOI18N
        digitalcheck.setText("Digital");
        BG1.add(digitalcheck, new org.netbeans.lib.awtextra.AbsoluteConstraints(550, 380, 70, 30));

        buttonGroup1.add(efectivocheck);
        efectivocheck.setFont(new java.awt.Font("Segoe UI", 0, 14)); // NOI18N
        efectivocheck.setText("Efectivo");
        BG1.add(efectivocheck, new org.netbeans.lib.awtextra.AbsoluteConstraints(430, 380, 80, 30));

        metodopagotxt.setFont(new java.awt.Font("Segoe UI", 2, 14)); // NOI18N
        metodopagotxt.setText("Metodo de Pago:");
        BG1.add(metodopagotxt, new org.netbeans.lib.awtextra.AbsoluteConstraints(430, 330, -1, 38));

        barberosBox.setModel(new javax.swing.DefaultComboBoxModel<>(new String[] { "Seleccionar" }));
        BG1.add(barberosBox, new org.netbeans.lib.awtextra.AbsoluteConstraints(510, 180, 130, 40));

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(this);
        this.setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, layout.createSequentialGroup()
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addComponent(BG1, javax.swing.GroupLayout.PREFERRED_SIZE, 681, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap())
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, layout.createSequentialGroup()
                .addGap(0, 0, Short.MAX_VALUE)
                .addComponent(BG1, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
        );
    }// </editor-fold>//GEN-END:initComponents

    public Date getSelectedDate() {
        return jCalendar2.getDate();
    }

    public List<String> getSelectedServices() {
        List<String> services = new ArrayList<>();
        if (cortecheck.isSelected()) services.add("Corte de pelo");
        if (barbacheck.isSelected()) services.add("Barba");
        if (exfoliacioncheck.isSelected()) services.add("Exfoliación a vapor");
        return services;
    }

    public String getSelectedPaymentMethod() {
        // Devolver valores que coincidan con el ENUM de la BD: 'efectivo', 'tarjeta', 'transferencia', 'otro'
        if (digitalcheck.isSelected()) return "tarjeta";  // Digital = tarjeta
        if (efectivocheck.isSelected()) return "efectivo";  // Efectivo en minúscula
        return "efectivo";  // Por defecto efectivo
    }

    public String getSelectedHour() {
        return (String) horabox.getSelectedItem();
    }

    private void jButton1ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jButton1ActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_jButton1ActionPerformed

    private void jButton2ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jButton2ActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_jButton2ActionPerformed

    private void jButtonLimpiarActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jButtonLimpiarActionPerformed
    }//GEN-LAST:event_jButtonLimpiarActionPerformed

    private void jButtonGuardarFechaActionPerformed(java.awt.event.ActionEvent evt) {
    }

    private void jButtonRegistrarCitaActionPerformed(java.awt.event.ActionEvent evt) {
    }


    // Variables declaration - do not modify//GEN-BEGIN:variables
    public javax.swing.JPanel BG;
    public javax.swing.JPanel BG1;
    public javax.swing.JLabel Subtitulo1;
    public javax.swing.JLabel Titulo;
    public javax.swing.JLabel Titulo1;
    public javax.swing.JCheckBox barbacheck;
    public javax.swing.JComboBox<String> barberosBox;
    public javax.swing.ButtonGroup buttonGroup1;
    public javax.swing.JCheckBox cortecheck;
    public javax.swing.JCheckBox digitalcheck;
    public javax.swing.JCheckBox efectivocheck;
    public javax.swing.JCheckBox exfoliacioncheck;
    public javax.swing.JComboBox<String> horabox;
    public javax.swing.JLabel horatxt;
    public javax.swing.JButton jButton1;
    public javax.swing.JButton jButton2;
    public javax.swing.JButton jButton3;
    public javax.swing.JButton jButtonGuardarFecha;
    public javax.swing.JButton jButtonLimpiar;
    public javax.swing.JButton jButtonRegistrarCita;
    public com.toedter.calendar.JCalendar jCalendar1;
    public com.toedter.calendar.JCalendar jCalendar2;
    public javax.swing.JLabel jLabel1;
    public javax.swing.JLabel jLabel2;
    public javax.swing.JLabel jLabel3;
    public javax.swing.JLabel jLabel4;
    public javax.swing.JLabel jLabel5;
    public javax.swing.JLabel jLabel6;
    public javax.swing.JPanel jPanel1;
    public javax.swing.JPanel jPanel2;
    public javax.swing.JPanel jPanel4;
    public javax.swing.JSeparator jSeparator1;
    public javax.swing.JSeparator jSeparator2;
    public javax.swing.JSeparator jSeparator3;
    public javax.swing.JSeparator jSeparator4;
    public javax.swing.JLabel metodopagotxt;
    public javax.swing.JLabel seleccionarbtxt;
    public javax.swing.JLabel txtMostrarFecha;
    // End of variables declaration//GEN-END:variables
}
