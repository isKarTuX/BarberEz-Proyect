/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package Controlador.VistaAdmin;

import Modelo.Admin;
import Modelo.Conexiones.ConsultaDB;
import Vistas.Admin.*;

import javax.swing.*;
import java.awt.BorderLayout;
import java.util.HashMap;
import java.util.Map;

/**
 *
 * @author andre
 */
public class VerIngresosC {
        private PanelVerIngresos pvi;
    private Admin admin;

    public VerIngresosC(PanelVerIngresos pi, Admin admin) {
        this.pvi = pi;
        this.admin = admin;
        cargarIngresos();
    }

    public void iniciar(AdminVistaDefault vista) {
        pvi.setSize(690, 530);
        pvi.setLocation(0, 0);
        vista.contenido.removeAll();
        vista.contenido.add(pvi, BorderLayout.CENTER);
        vista.contenido.revalidate();
        vista.contenido.repaint();
    }

    private void cargarIngresos() {
        pvi.verIngresosDiarios.setText("Cargando...");
        pvi.IngresosTotalesTxt.setText("Cargando...");
        pvi.GananciasTxt.setText("Cargando...");

        ConsultaDB<Map<String, Double>> consultaDB = new ConsultaDB<>(
                null,
                () -> {
                    // Obtenemos ingresos diarios únicamente para el panel de ingresos diarios.
                    Map<String, Double> ingresosDiarios = admin.ingresosDiariosPorBarbero();

                    // Obtenemos ingresos totales y ganancias para mostrar en sus respectivos campos.
                    double ingresosTotales = admin.ingresosTotales();
                    double comision = admin.obtenerPorcentajeComision();
                    double ganancias = admin.calcularGanancias(comision);

                    // Construimos un mapa con los resultados finales.
                    Map<String, Double> datos = new HashMap<>();
                    datos.put("Ingresos Totales", ingresosTotales);
                    datos.put("Ganancias", ganancias);
                    datos.putAll(ingresosDiarios);
                    return datos;
                },
                new ConsultaDB.DatabaseTaskListener<>() {
                    @Override
                    public void onSuccess(Map<String, Double> datos) {
                        // Mostramos solo los ingresos diarios en "verIngresosDiarios".
                        StringBuilder sb = new StringBuilder();
                        for (Map.Entry<String, Double> entry : datos.entrySet()) {
                            if (!entry.getKey().equals("Ingresos Totales") && !entry.getKey().equals("Ganancias")) {
                                sb.append(entry.getKey()).append(": $").append(String.format("%,.2f", entry.getValue())).append("\n");
                            }
                        }
                        String ingresosDiariosText = sb.toString();
                        System.out.println("Ingresos Diarios: " + ingresosDiariosText); // Logging for debugging
                        pvi.verIngresosDiarios.setText(ingresosDiariosText);

                        // Mostramos los ingresos totales y ganancias en sus respectivos campos.
                        String ingresosTotalesText = String.format("$ %,.2f", datos.get("Ingresos Totales"));
                        String gananciasText = String.format("$ %,.2f", datos.get("Ganancias"));
                        System.out.println("Ingresos Totales: " + ingresosTotalesText); // Logging for debugging
                        System.out.println("Ganancias: " + gananciasText); // Logging for debugging
                        pvi.IngresosTotalesTxt.setText(ingresosTotalesText);
                        pvi.GananciasTxt.setText(gananciasText);
                    }

                    @Override
                    public void onError(Exception e) {
                        e.printStackTrace();
                        JOptionPane.showMessageDialog(pvi, "Error al cargar los ingresos: " + e.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
                    }
                }
        );
        consultaDB.execute();
    }
}

