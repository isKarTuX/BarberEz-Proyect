package Modelo;

import Modelo.Conexiones.ConexionDB;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

public class Barbero extends Usuario {
    private int idBarbero;

    public Barbero(String usuario, String contrasena) {
        super(usuario, contrasena, "Barbero");
        this.idBarbero = obtenerIdBarbero(usuario);
    }

    @Override
    public boolean iniciarSesion() {
        return false;
    }

    private int obtenerIdBarbero(String usuario) {
        int id = -1;
        String query = "SELECT b.idBarbero FROM barbero b " +
                      "INNER JOIN usuario u ON b.idBarbero = u.idUsuario " +
                      "WHERE u.nombre = ? OR u.correo = ?";
        try (Connection cx = ConexionDB.getInstance().getConnection();
             PreparedStatement ps = cx.prepareStatement(query)) {
            ps.setString(1, usuario);
            ps.setString(2, usuario);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    id = rs.getInt("idBarbero");
                }
            }
        } catch (SQLException e) {
            Logger.getLogger(Barbero.class.getName()).log(Level.SEVERE, null, e);
        }
        return id;
    }

    public String verComisionesPorFecha(String fecha) {
        String comisiones = "";
        // Calcular comisiones basadas en citas completadas y pagos
        String query = "SELECT COUNT(DISTINCT c.idCita) AS servicios, SUM(p.monto) AS total " +
                      "FROM cita c " +
                      "INNER JOIN pago p ON c.idCita = p.idCita " +
                      "WHERE c.idBarbero = ? AND DATE(c.fecha) = ? AND c.estado = 'completada'";
        try (Connection cx = ConexionDB.getInstance().getConnection();
             PreparedStatement ps = cx.prepareStatement(query)) {
            ps.setInt(1, this.idBarbero);
            ps.setString(2, fecha);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    int servicios = rs.getInt("servicios");
                    double total = rs.getDouble("total");
                    double comision = total * 0.5;
                    comisiones = "Servicios: " + servicios + ", Total: " + total + ", Comisión: " + comision;
                }
            }
        } catch (SQLException e) {
            Logger.getLogger(Barbero.class.getName()).log(Level.SEVERE, null, e);
        }
        return comisiones;
    }

    public List<String> obtenerCitasPendientes() {
        List<String> citasPendientes = new ArrayList<>();
        // Incluir el nombre del cliente en la consulta principal con JOIN
        String query = "SELECT c.fecha, c.horaIn, u.nombre AS nombreCliente, " +
                      "GROUP_CONCAT(s.nombre SEPARATOR ', ') AS servicios " +
                      "FROM cita c " +
                      "INNER JOIN cliente cl ON c.idCliente = cl.idCliente " +
                      "INNER JOIN usuario u ON cl.idCliente = u.idUsuario " +
                      "LEFT JOIN servicioCita sc ON c.idCita = sc.idCita " +
                      "LEFT JOIN servicio s ON sc.idSer = s.idSer " +
                      "WHERE c.idBarbero = ? AND c.estado = 'pendiente' " +
                      "GROUP BY c.idCita, c.fecha, c.horaIn, u.nombre";

        try (Connection cx = ConexionDB.getInstance().getConnection();
             PreparedStatement ps = cx.prepareStatement(query)) {
            ps.setInt(1, this.idBarbero);

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Date fecha = rs.getDate("fecha");
                    String hora = rs.getTime("horaIn").toString();
                    String servicios = rs.getString("servicios");
                    String cliente = rs.getString("nombreCliente");

                    // Validar si servicios es null o vacío
                    if (servicios == null || servicios.trim().isEmpty()) {
                        servicios = "Sin servicios asignados";
                    }


                    String cita = fecha + " " + hora + " " + servicios + " " + cliente;
                    citasPendientes.add(cita);
                }
            }
        } catch (SQLException e) {
            Logger.getLogger(Barbero.class.getName()).log(Level.SEVERE, null, e);
        }

        return citasPendientes;
    }

    public List<String> obtenerCitasCompletadas() {
        List<String> citasCompletadas = new ArrayList<>();
        // Incluir el nombre del cliente en la consulta principal con JOIN
        String query = "SELECT c.fecha, c.horaIn, u.nombre AS nombreCliente, " +
                      "GROUP_CONCAT(s.nombre SEPARATOR ', ') AS servicios " +
                      "FROM cita c " +
                      "INNER JOIN cliente cl ON c.idCliente = cl.idCliente " +
                      "INNER JOIN usuario u ON cl.idCliente = u.idUsuario " +
                      "LEFT JOIN servicioCita sc ON c.idCita = sc.idCita " +
                      "LEFT JOIN servicio s ON sc.idSer = s.idSer " +
                      "WHERE c.idBarbero = ? AND c.estado = 'completada' " +
                      "GROUP BY c.idCita, c.fecha, c.horaIn, u.nombre";

        try (Connection cx = ConexionDB.getInstance().getConnection();
             PreparedStatement ps = cx.prepareStatement(query)) {
            ps.setInt(1, this.idBarbero);

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Date fecha = rs.getDate("fecha");
                    String hora = rs.getTime("horaIn").toString();
                    String servicios = rs.getString("servicios");
                    String cliente = rs.getString("nombreCliente");

                    // Validar si servicios es null o vacío
                    if (servicios == null || servicios.trim().isEmpty()) {
                        servicios = "Sin servicios asignados";
                    }


                    String cita = fecha + " " + hora + " " + servicios + " " + cliente;
                    citasCompletadas.add(cita);
                }
            }
        } catch (SQLException e) {
            Logger.getLogger(Barbero.class.getName()).log(Level.SEVERE, null, e);
        }

        return citasCompletadas;
    }

    private String obtenerNombreCliente(int idCliente) {
        String nombre = "";
        String query = "SELECT u.nombre FROM usuario u " +
                      "INNER JOIN cliente c ON u.idUsuario = c.idCliente " +
                      "WHERE c.idCliente = ?";

        try (Connection cx = ConexionDB.getInstance().getConnection();
             PreparedStatement ps = cx.prepareStatement(query)) {
            ps.setInt(1, idCliente);

            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    nombre = rs.getString("nombre");
                }
            }
        } catch (SQLException e) {
            Logger.getLogger(Barbero.class.getName()).log(Level.SEVERE, null, e);
        }

        return nombre;
    }

    private String extraerNombreCliente(String cliente) {
        String[] parts = cliente.split(" ");
        return parts[parts.length - 1]; // Return the last word
    }

    public boolean confirmarCita(String fecha, String hora, String cliente) {
        String nombreCliente = extraerNombreCliente(cliente);
        int idCliente = obtenerIdCliente(nombreCliente);
        if (idCliente == -1) {
            Logger.getLogger(Barbero.class.getName()).log(Level.SEVERE, "Cliente no encontrado: " + nombreCliente);
            return false;
        }
        
        // Cambiar estado de 'pendiente' a 'confirmada'
        String updateCitaQuery = "UPDATE cita SET estado = 'confirmada' WHERE idBarbero = ? AND fecha = ? AND horaIn = ? AND idCliente = ? AND estado = 'pendiente'";
        try (Connection cx = ConexionDB.getInstance().getConnection();
             PreparedStatement updatePs = cx.prepareStatement(updateCitaQuery)) {

            updatePs.setInt(1, this.idBarbero);
            updatePs.setString(2, fecha);
            updatePs.setString(3, hora);
            updatePs.setInt(4, idCliente);
            int updateCount = updatePs.executeUpdate();

            if (updateCount > 0) {
                Logger.getLogger(Barbero.class.getName()).log(Level.INFO, 
                    "Cita confirmada: " + fecha + " " + hora + " con " + nombreCliente);
            }
            
            return updateCount > 0;
        } catch (SQLException e) {
            Logger.getLogger(Barbero.class.getName()).log(Level.SEVERE, "Error al confirmar cita", e);
        }
        return false;
    }

    private int obtenerIdCliente(String nombreCliente) {
        int id = -1;
        String query = "SELECT c.idCliente FROM cliente c " +
                      "INNER JOIN usuario u ON c.idCliente = u.idUsuario " +
                      "WHERE u.nombre = ?";
        try (Connection cx = ConexionDB.getInstance().getConnection();
             PreparedStatement ps = cx.prepareStatement(query)) {
            ps.setString(1, nombreCliente);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    id = rs.getInt("idCliente");
                }
            }
        } catch (SQLException e) {
            Logger.getLogger(Barbero.class.getName()).log(Level.SEVERE, null, e);
        }
        return id;
    }

    public List<String> obtenerGananciasDiarias() {
        List<String> gananciasDiarias = new ArrayList<>();
        String query = "SELECT GROUP_CONCAT(s.nombre SEPARATOR ', ') AS servicios, p.monto " +
                      "FROM cita c " +
                      "INNER JOIN pago p ON c.idCita = p.idCita " +
                      "LEFT JOIN servicioCita sc ON c.idCita = sc.idCita " +
                      "LEFT JOIN servicio s ON sc.idSer = s.idSer " +
                      "WHERE c.idBarbero = ? AND DATE(c.fecha) = CURDATE() AND c.estado = 'completada' " +
                      "GROUP BY c.idCita, p.monto";

        try (Connection cx = ConexionDB.getInstance().getConnection(); PreparedStatement ps = cx.prepareStatement(query)) {
            ps.setInt(1, this.idBarbero);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    String servicios = rs.getString("servicios");
                    double monto = rs.getDouble("monto");
                    if (rs.wasNull()) {
                        monto = 0;
                    }
                    gananciasDiarias.add(String.format("Servicios: %s, Monto: $%,.2f", servicios, monto));
                }
            }
        } catch (SQLException e) {
            Logger.getLogger(Barbero.class.getName()).log(Level.SEVERE, null, e);
        }
        return gananciasDiarias;
    }

    public double obtenerIngresosTotales() {
        double total = 0.0;
        String query = "SELECT SUM(p.monto) AS total FROM cita c " +
                      "INNER JOIN pago p ON c.idCita = p.idCita " +
                      "WHERE c.idBarbero = ? AND c.estado = 'completada'";
        try (Connection cx = ConexionDB.getInstance().getConnection();PreparedStatement ps = cx.prepareStatement(query)) {
            ps.setInt(1, this.idBarbero);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    total = rs.getDouble("total");
                }
            }
        } catch (SQLException e) {
            Logger.getLogger(Barbero.class.getName()).log(Level.SEVERE, null, e);
        }
        return total;
    }

    public double obtenerPorcentajeComision() {
        double comision = 0.0;
        String query = "SELECT comision FROM barbero WHERE idBarbero = ?";
        try (Connection cx = ConexionDB.getInstance().getConnection();
             PreparedStatement ps = cx.prepareStatement(query)) {
            ps.setInt(1, this.idBarbero);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    comision = rs.getDouble("comision");
                }
            }
        } catch (SQLException e) {
            Logger.getLogger(Barbero.class.getName()).log(Level.SEVERE, null, e);
        }
        return comision / 100.0; // Convertir de porcentaje a decimal
    }

    /**
     * Completa una cita que ya fue confirmada.
     * Cambia el estado de 'confirmada' a 'completada'.
     */
    public boolean completarCita(String fecha, String hora, String cliente) {
        String nombreCliente = extraerNombreCliente(cliente);
        int idCliente = obtenerIdCliente(nombreCliente);
        if (idCliente == -1) {
            Logger.getLogger(Barbero.class.getName()).log(Level.SEVERE, "Cliente no encontrado: " + nombreCliente);
            return false;
        }
        
        // Cambiar estado de 'confirmada' a 'completada'
        String updateCitaQuery = "UPDATE cita SET estado = 'completada' WHERE idBarbero = ? AND fecha = ? AND horaIn = ? AND idCliente = ? AND estado = 'confirmada'";
        try (Connection cx = ConexionDB.getInstance().getConnection();
             PreparedStatement updatePs = cx.prepareStatement(updateCitaQuery)) {

            updatePs.setInt(1, this.idBarbero);
            updatePs.setString(2, fecha);
            updatePs.setString(3, hora);
            updatePs.setInt(4, idCliente);
            int updateCount = updatePs.executeUpdate();

            if (updateCount > 0) {
                Logger.getLogger(Barbero.class.getName()).log(Level.INFO, 
                    "Cita completada: " + fecha + " " + hora + " con " + nombreCliente);
            }
            
            return updateCount > 0;
        } catch (SQLException e) {
            Logger.getLogger(Barbero.class.getName()).log(Level.SEVERE, "Error al completar cita", e);
        }
        return false;
    }

}