package Modelo;

import Modelo.Conexiones.ConexionDB;

import java.sql.*;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

public class Cliente extends Usuario {
    private int idCliente;

    public Cliente(String usuario, String contrasena) {
        super(usuario, contrasena, "Cliente");
        this.idCliente = obtenerIdCliente(usuario);
    }

    @Override
    public boolean iniciarSesion() {
        return false;
    }

    private int obtenerIdCliente(String usuario) {
        try (Connection cx = ConexionDB.getInstance().getConnection()) {
            // Buscar en la tabla usuario y verificar que sea cliente
            String query = "SELECT u.idUsuario FROM usuario u " +
                          "INNER JOIN cliente c ON u.idUsuario = c.idCliente " +
                          "WHERE u.nombre = ? OR u.correo = ?";
            PreparedStatement ps = cx.prepareStatement(query);
            ps.setString(1, usuario);
            ps.setString(2, usuario);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                return rs.getInt("idUsuario");
            }
        } catch (SQLException e) {
            Logger.getLogger(Cliente.class.getName()).log(Level.SEVERE, null, e);
        }
        return -1;
    }

    public boolean reservarCita(Date fecha, String hora, String categoria, String barbero, String metodoPago) {
        int idBarbero = obtenerIdBarbero(barbero);
        if (idBarbero == -1) {
            Logger.getLogger(Cliente.class.getName()).log(Level.SEVERE, "Barbero no encontrado: " + barbero);
            return false;
        }

        try (Connection cx = ConexionDB.getInstance().getConnection()) {
            // Usar el procedimiento almacenado sp_agendar_cita
            String query = "{CALL sp_agendar_cita(?, ?, ?, ?, ?)}";
            CallableStatement cs = cx.prepareCall(query);
            cs.setDate(1, new java.sql.Date(fecha.getTime()));        // fecha
            cs.setTime(2, java.sql.Time.valueOf(hora + ":00"));       // horaIn
            cs.setInt(3, this.idCliente);                             // idCliente
            cs.setInt(4, idBarbero);                                  // idBarbero
            cs.registerOutParameter(5, java.sql.Types.INTEGER);       // idCita (OUT)

            cs.execute();

            // Obtener el ID de la cita creada
            int idCita = cs.getInt(5);

            if (idCita > 0) {
                // Separar los servicios si vienen múltiples (ej: "Corte de cabello, Arreglo de barba")
                String[] servicios = categoria.split(",");
                int serviciosAgregados = 0;

                for (String nombreServicio : servicios) {
                    nombreServicio = nombreServicio.trim(); // Eliminar espacios

                    // Obtener el idSer basado en el nombre del servicio
                    int idServicio = obtenerIdServicio(nombreServicio, cx);

                    if (idServicio > 0) {
                        try {
                            String queryServicio = "{CALL sp_agregar_servicio(?, ?)}";
                            CallableStatement csServicio = cx.prepareCall(queryServicio);
                            csServicio.setInt(1, idCita);
                            csServicio.setInt(2, idServicio);
                            csServicio.execute();
                            serviciosAgregados++;
                            Logger.getLogger(Cliente.class.getName()).log(Level.INFO,
                                "Servicio agregado: " + nombreServicio + " (ID: " + idServicio + ")");
                        } catch (SQLException e) {
                            Logger.getLogger(Cliente.class.getName()).log(Level.WARNING,
                                "Error al agregar servicio: " + nombreServicio, e);
                        }
                    } else {
                        Logger.getLogger(Cliente.class.getName()).log(Level.WARNING,
                            "Servicio no encontrado: " + nombreServicio);
                    }
                }

                // Registrar el pago solo si se agregó al menos un servicio
                if (serviciosAgregados > 0) {
                    try {
                        String queryPago = "{CALL sp_registrar_pago(?, ?)}";
                        CallableStatement csPago = cx.prepareCall(queryPago);
                        csPago.setInt(1, idCita);
                        csPago.setString(2, metodoPago);
                        csPago.execute();
                        Logger.getLogger(Cliente.class.getName()).log(Level.INFO,
                            "Pago registrado exitosamente para cita: " + idCita);
                        return true;
                    } catch (SQLException e) {
                        Logger.getLogger(Cliente.class.getName()).log(Level.SEVERE,
                            "Error al registrar pago", e);
                        // Aún así retornar true porque la cita se creó
                        return true;
                    }
                } else {
                    Logger.getLogger(Cliente.class.getName()).log(Level.SEVERE,
                        "No se pudo agregar ningún servicio a la cita");
                    return false;
                }
            }
        } catch (SQLException e) {
            Logger.getLogger(Cliente.class.getName()).log(Level.SEVERE, "Error al reservar cita", e);
        }

        return false;
    }

    private int obtenerIdServicio(String nombreServicio, Connection cx) {
        try {
            String query = "SELECT idSer FROM servicio WHERE nombre = ? AND activo = TRUE";
            PreparedStatement ps = cx.prepareStatement(query);
            ps.setString(1, nombreServicio);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                return rs.getInt("idSer");
            }
        } catch (SQLException e) {
            Logger.getLogger(Cliente.class.getName()).log(Level.SEVERE, null, e);
        }
        return -1;
    }

    public int obtenerIdBarbero(String nombreBarbero) {
        try (Connection cx = ConexionDB.getInstance().getConnection()) {
            // Buscar en usuario unido con barbero
            // Usar búsqueda exacta para evitar confusiones con nombres similares
            String query = "SELECT b.idBarbero FROM barbero b " +
                          "INNER JOIN usuario u ON b.idBarbero = u.idUsuario " +
                          "WHERE u.nombre = ?";
            PreparedStatement ps = cx.prepareStatement(query);
            ps.setString(1, nombreBarbero);  // Búsqueda exacta
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                return rs.getInt("idBarbero");
            }

            // Si no encuentra con búsqueda exacta, intentar con LIKE como respaldo
            // solo para cancelar citas donde se pasa nombre parcial
            query = "SELECT b.idBarbero FROM barbero b " +
                   "INNER JOIN usuario u ON b.idBarbero = u.idUsuario " +
                   "WHERE u.nombre LIKE ? " +
                   "LIMIT 1";  // Solo devolver uno para evitar ambigüedad
            ps = cx.prepareStatement(query);
            ps.setString(1, "%" + nombreBarbero + "%");
            rs = ps.executeQuery();
            if (rs.next()) {
                return rs.getInt("idBarbero");
            }
        } catch (SQLException e) {
            Logger.getLogger(Cliente.class.getName()).log(Level.SEVERE, null, e);
        }
        return -1;
    }

    public boolean verificarIdCliente(int idCliente) {
        try (Connection cx = ConexionDB.getInstance().getConnection()) {
            String query = "SELECT idCliente FROM cliente WHERE idCliente = ?";
            PreparedStatement ps = cx.prepareStatement(query);
            ps.setInt(1, idCliente);
            ResultSet rs = ps.executeQuery();
            return rs.next();
        } catch (SQLException e) {
            Logger.getLogger(Cliente.class.getName()).log(Level.SEVERE, null, e);
        }
        return false;
    }

    public List<String> obtenerBarberos() {
        List<String> barberos = new ArrayList<>();
        String query = "SELECT u.nombre FROM usuario u " +
                      "INNER JOIN barbero b ON u.idUsuario = b.idBarbero " +
                      "WHERE u.rol = 'barbero'";

        try (Connection cx = ConexionDB.getInstance().getConnection(); Statement stmt = cx.createStatement(); ResultSet rs = stmt.executeQuery(query)) {

            while (rs.next()) {
                barberos.add(rs.getString("nombre"));
            }
        } catch (SQLException e) {
            Logger.getLogger(Cliente.class.getName()).log(Level.SEVERE, null, e);
        }
        return barberos;
    }

    private String obtenerNombreBarbero(int idBarbero) {
        String nombreBarbero = "";
        String query = "SELECT u.nombre FROM usuario u " +
                      "INNER JOIN barbero b ON u.idUsuario = b.idBarbero " +
                      "WHERE b.idBarbero = ?";

        try (Connection cx = ConexionDB.getInstance().getConnection();PreparedStatement ps = cx.prepareStatement(query)) {
            ps.setInt(1, idBarbero);

            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    nombreBarbero = rs.getString("nombre");
                }
            }
        } catch (SQLException e) {
            Logger.getLogger(Cliente.class.getName()).log(Level.SEVERE, null, e);
        }

        return nombreBarbero;
    }

    public List<String> obtenerHorasDisponibles(int idBarbero, Date fechaSeleccionada) {
        List<String> todasHoras = generarListaHoras();
        List<String> horasOcupadas = new ArrayList<>();

        // Obtener las horas ocupadas desde la tabla cita
        String query = "SELECT horaIn FROM cita WHERE idBarbero = ? AND fecha = ? AND estado IN ('pendiente', 'confirmada')";

        try (Connection cx = ConexionDB.getInstance().getConnection(); PreparedStatement ps = cx.prepareStatement(query)) {
            ps.setInt(1, idBarbero);
            ps.setDate(2, new java.sql.Date(fechaSeleccionada.getTime()));

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    horasOcupadas.add(rs.getTime("horaIn").toString());
                }
            }
        } catch (SQLException e) {
            Logger.getLogger(Cliente.class.getName()).log(Level.SEVERE, null, e);
        }

        todasHoras.removeAll(horasOcupadas);
        return todasHoras;
    }

    private List<String> generarListaHoras() {
        List<String> horas = new ArrayList<>();
        LocalTime inicio = LocalTime.of(8, 0);
        LocalTime fin = LocalTime.of(20, 0);

        while (!inicio.isAfter(fin)) {
            horas.add(inicio.toString());
            inicio = inicio.plusMinutes(30);
        }
        return horas;
    }

    public List<String> obtenerCitasPendientes() {
        List<String> citas = new ArrayList<>();
        // Incluir el nombre del barbero en la consulta principal con JOIN
        String query = "SELECT c.fecha, c.horaIn, u.nombre AS nombreBarbero, " +
                      "GROUP_CONCAT(s.nombre SEPARATOR ', ') AS servicios " +
                      "FROM cita c " +
                      "INNER JOIN barbero b ON c.idBarbero = b.idBarbero " +
                      "INNER JOIN usuario u ON b.idBarbero = u.idUsuario " +
                      "LEFT JOIN servicioCita sc ON c.idCita = sc.idCita " +
                      "LEFT JOIN servicio s ON sc.idSer = s.idSer " +
                      "WHERE c.idCliente = ? AND c.estado = 'pendiente' " +
                      "GROUP BY c.idCita, c.fecha, c.horaIn, u.nombre";

        try (Connection cx = ConexionDB.getInstance().getConnection();
             PreparedStatement ps = cx.prepareStatement(query)) {
            ps.setInt(1, this.idCliente);

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Date fecha = rs.getDate("fecha");
                    String hora = rs.getTime("horaIn").toString();
                    String servicios = rs.getString("servicios");
                    String barbero = rs.getString("nombreBarbero");

                    // Validar si servicios es null o vacío
                    if (servicios == null || servicios.trim().isEmpty()) {
                        servicios = "Sin servicios asignados";
                    }


                    String cita = fecha.toString() + " " + hora + " " + servicios + " " + barbero;
                    citas.add(cita);
                }
            }
        } catch (SQLException e) {
            Logger.getLogger(Cliente.class.getName()).log(Level.SEVERE, null, e);
        }

        return citas;
    }

    public List<String> obtenerCitasCompletadas() {
        List<String> citas = new ArrayList<>();
        // Incluir el nombre del barbero en la consulta principal con JOIN
        String query = "SELECT c.fecha, c.horaIn, u.nombre AS nombreBarbero, " +
                      "GROUP_CONCAT(s.nombre SEPARATOR ', ') AS servicios " +
                      "FROM cita c " +
                      "INNER JOIN barbero b ON c.idBarbero = b.idBarbero " +
                      "INNER JOIN usuario u ON b.idBarbero = u.idUsuario " +
                      "LEFT JOIN servicioCita sc ON c.idCita = sc.idCita " +
                      "LEFT JOIN servicio s ON sc.idSer = s.idSer " +
                      "WHERE c.idCliente = ? AND c.estado = 'completada' " +
                      "GROUP BY c.idCita, c.fecha, c.horaIn, u.nombre";

        try (Connection cx = ConexionDB.getInstance().getConnection();
             PreparedStatement ps = cx.prepareStatement(query)) {
            ps.setInt(1, this.idCliente);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Date fecha = rs.getDate("fecha");
                    String hora = rs.getTime("horaIn").toString();
                    String servicios = rs.getString("servicios");
                    String barbero = rs.getString("nombreBarbero");

                    // Validar si servicios es null o vacío
                    if (servicios == null || servicios.trim().isEmpty()) {
                        servicios = "Sin servicios asignados";
                    }


                    String cita = fecha.toString() + " " + hora + " " + servicios + " " + barbero;
                    citas.add(cita);
                }
            }
        } catch (SQLException e) {
            Logger.getLogger(Cliente.class.getName()).log(Level.SEVERE, null, e);
        }

        return citas;
    }

    public boolean cancelarCita(String fecha, String hora, String barbero) {
        int idBarbero = obtenerIdBarbero(barbero);
        if (idBarbero == -1) {
            Logger.getLogger(Cliente.class.getName()).log(Level.SEVERE, "Barbero no encontrado: " + barbero);
            return false;
        }
        // En lugar de eliminar, actualizar el estado a 'cancelada'
        String updateCitaQuery = "UPDATE cita SET estado = 'cancelada' WHERE idCliente = ? AND fecha = ? AND horaIn = ? AND idBarbero = ?";
        try (Connection cx = ConexionDB.getInstance().getConnection();
             PreparedStatement updateCitaPs = cx.prepareStatement(updateCitaQuery)) {

            // Update estado de la cita
            updateCitaPs.setInt(1, this.idCliente);
            updateCitaPs.setString(2, fecha);
            updateCitaPs.setString(3, hora);
            updateCitaPs.setInt(4, idBarbero);
            int updateCount = updateCitaPs.executeUpdate();


            return updateCount > 0;
        } catch (SQLException e) {
            Logger.getLogger(Cliente.class.getName()).log(Level.SEVERE, null, e);
        }
        return false;
    }
}
