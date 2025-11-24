package Modelo.Conexiones;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;

public class ConexionDB {

    private static ConexionDB instance;
    private final String bd = "barberia_barberez";
    private final String url = "jdbc:mysql://148.230.94.152:3306/"+bd+"?useSSL=false&useTimezone=true&serverTimezone=UTC&allowPublicKeyRetrieval=true";
    private final String user = "root";
    private final String password = "root";
    private final String driver = "com.mysql.cj.jdbc.Driver";

    private ConexionDB() {
        try {
            Class.forName(driver);
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(ConexionDB.class.getName()).log(Level.SEVERE, "Driver no encontrado", ex);
        }
    }

    public static ConexionDB getInstance() {
        if (instance == null) {
            synchronized (ConexionDB.class) {
                if (instance == null) {
                    instance = new ConexionDB();
                }
            }
        }
        return instance;
    }

    /**
     * Obtiene una NUEVA conexión cada vez que se llama.
     * Esto evita problemas con múltiples hilos cerrando la misma conexión.
     * Usar con try-with-resources para cerrar automáticamente.
     */
    public Connection getConnection() throws SQLException {
        return DriverManager.getConnection(url, user, password);
    }
}

