package Observer;

import Modelo.Conexiones.ConexionDB;
import java.sql.*;
import java.util.List;

public class NotificationPoller {

    private final BarberoSubject barberoSubject; // Sujeto para manejar observadores

    public NotificationPoller(BarberoSubject barberoSubject) {
        this.barberoSubject = barberoSubject;
    }

    public void pollNotifications() {
        try {
            // Verificar si la tabla notifications existe (solo una vez)
            try (Connection testConn = ConexionDB.getInstance().getConnection()) {
                DatabaseMetaData meta = testConn.getMetaData();
                try (ResultSet tables = meta.getTables(null, null, "notifications", null)) {
                    boolean tableExists = tables.next();

                    if (!tableExists) {
                        System.out.println("Advertencia: La tabla 'notifications' no existe. El sistema de notificaciones está desactivado.");
                        System.out.println("Para activarlo, ejecuta el script 'crear_tabla_notifications.sql'");
                        return; // Salir sin error
                    }
                }
            } catch (SQLException e) {
                System.err.println("No se pudo verificar tabla notifications: " + e.getMessage());
                return;
            }

            while (true) {
                // Obtener una nueva conexión en cada iteración
                try (Connection conn = ConexionDB.getInstance().getConnection()) {
                    String query = "SELECT id, message FROM notifications WHERE processed = 0";
                    try (Statement stmt = conn.createStatement();
                         ResultSet rs = stmt.executeQuery(query)) {

                        while (rs.next()) {
                            String message = rs.getString("message");
                            int id = rs.getInt("id");

                            // Notificar a los observadores
                            barberoSubject.notifyObservers(List.of(message));

                            // Marcar como procesada
                            String updateQuery = "UPDATE notifications SET processed = 1 WHERE id = ?";
                            try (PreparedStatement ps = conn.prepareStatement(updateQuery)) {
                                ps.setInt(1, id);
                                ps.executeUpdate();
                            }
                        }
                    }
                } catch (SQLException e) {
                    // Solo mostrar error si no es por tabla inexistente o conexión cerrada
                    if (!e.getMessage().contains("doesn't exist") &&
                        !e.getMessage().contains("connection closed")) {
                        System.err.println("Error en NotificationPoller: " + e.getMessage());
                    }
                }

                // Espera 5 segundos antes de realizar otra consulta
                Thread.sleep(5000);
            }
        } catch (Exception e) {
            System.err.println("Error fatal en NotificationPoller: " + e.getMessage());
        }
    }

}
