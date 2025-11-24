package Modelo;

import Modelo.Conexiones.ConexionDB;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.DecimalFormat;
import java.util.*;
import java.util.logging.Level;
import java.util.logging.Logger;

public class Admin extends Usuario {
    private int idAdmin;

    public Admin(String usuario, String contrasena) {
        super(usuario, contrasena, "Admin");
    }

    @Override
    public boolean iniciarSesion() {
        return false;
    }

    public boolean crearCuenta(String usuario, String contrasena, String rol) {
        // Usar el procedimiento almacenado para registrar usuarios
        String correo = usuario + "@barberez.com"; // Correo predeterminado
        String telefono = "0000000000"; // Teléfono predeterminado
        String cedula = "TEMP" + System.currentTimeMillis(); // Cédula temporal única
        double comision = 0.00;

        // Si es barbero, asignar una comisión predeterminada
        if ("barbero".equals(rol)) {
            comision = 15.00; // Comisión predeterminada para barberos
        }

        String query = "CALL sp_registrar_usuario(?, ?, ?, ?, ?, ?, ?)";
        try (Connection cx = ConexionDB.getInstance().getConnection();
             CallableStatement cs = cx.prepareCall(query)) {
            cs.setString(1, usuario);      // nombre
            cs.setString(2, correo);       // correo
            cs.setString(3, telefono);     // telefono
            cs.setString(4, contrasena);   // contrasena
            cs.setString(5, cedula);       // cedula
            cs.setString(6, rol);          // rol (admin, cliente, barbero)
            cs.setDouble(7, comision);     // comision
            cs.execute();
            return true;
        } catch (SQLException e) {
            Logger.getLogger(Admin.class.getName()).log(Level.SEVERE, null, e);
        }
        return false;
    }

    public List<String> obtenerCitasCompletadas() {
        List<String> citas = new ArrayList<>();
        // Usar la vista vista_citas_completas de la nueva BD
        String query = "SELECT fecha, horaIn, nombreBarbero, nombreCliente, totalCita, estadoPago, metodoPago " +
                "FROM vista_citas_completas " +
                "WHERE estado = 'completada'";
        try (Connection cx = ConexionDB.getInstance().getConnection();
             PreparedStatement ps = cx.prepareStatement(query);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                citas.add("Fecha: " + rs.getDate("fecha") +
                        " " + rs.getTime("horaIn") +
                        ", Barbero: " + rs.getString("nombreBarbero") +
                        ", Cliente: " + rs.getString("nombreCliente") +
                        ", Monto: $" + formatCurrency(rs.getDouble("totalCita")));
            }
        } catch (SQLException e) {
            Logger.getLogger(Admin.class.getName()).log(Level.SEVERE, null, e);
        }
        return citas;
    }


    public double ingresosTotales() {
        String query = "SELECT SUM(p.monto) AS ingreso_total " +
                "FROM pago p " +
                "INNER JOIN cita c ON p.idCita = c.idCita " +
                "WHERE c.estado = 'completada' AND p.estado = 'pagado'";
        try (Connection cx = ConexionDB.getInstance().getConnection();
             PreparedStatement ps = cx.prepareStatement(query);
             ResultSet rs = ps.executeQuery()) {
            if (rs.next()) {
                return rs.getDouble("ingreso_total");
            }
        } catch (SQLException e) {
            Logger.getLogger(Admin.class.getName()).log(Level.SEVERE, null, e);
        }
        return 0.0;
    }

    public double calcularGanancias(double porcentajeComision) {
        double ingresosTotales = ingresosTotales();
        return ingresosTotales * (1 - porcentajeComision);
    }

    public Map<String, Double> ingresosDiariosPorBarbero() {
        Map<String, Double> ingresos = new HashMap<>();
        String query = "SELECT u.nombre AS barbero, SUM(p.monto) AS ingreso, c.fecha " +
                "FROM cita c " +
                "INNER JOIN barbero b ON c.idBarbero = b.idBarbero " +
                "INNER JOIN usuario u ON b.idBarbero = u.idUsuario " +
                "INNER JOIN pago p ON c.idCita = p.idCita " +
                "WHERE c.estado = 'completada' " +
                "AND c.fecha = CURRENT_DATE " +
                "GROUP BY u.nombre, c.fecha";
        try (Connection cx = ConexionDB.getInstance().getConnection();
             PreparedStatement ps = cx.prepareStatement(query);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                String barbero = rs.getString("barbero");
                double ingreso = rs.getDouble("ingreso");
                Date fecha = rs.getDate("fecha");
                System.out.println("Barbero: " + barbero + ", Ingreso: " + ingreso + ", Fecha: " + fecha);
                ingresos.put(barbero, ingreso);
            }
        } catch (SQLException e) {
            Logger.getLogger(Admin.class.getName()).log(Level.SEVERE, "Error fetching daily income by barber", e);
        }
        System.out.println("Ingresos Diarios Map: " + ingresos);
        return ingresos;
    }

    private String formatCurrency(double amount) {
        DecimalFormat formatter = new DecimalFormat("#,###");
        return formatter.format(amount);
    }
    public double obtenerPorcentajeComision() {
        return 0.5;
    }
}