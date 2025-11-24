package Modelo.Conexiones;

import javax.swing.*;
import java.util.concurrent.Callable;

public class ConsultaDB<T> {
    private JDialog progressDialog;
    private Callable<T> task;  // Tarea que retorna un valor genérico
    private DatabaseTaskListener<T> listener;  // Listener para manejar los resultados

    public ConsultaDB(JFrame parent, Callable<T> task, DatabaseTaskListener<T> listener) {
        this.task = task;
        this.listener = listener;

        // Crear un diálogo de progreso
        progressDialog = new JDialog(parent, "Cargando...", true);
        progressDialog.setUndecorated(true);
        JProgressBar progressBar = new JProgressBar();
        progressBar.setIndeterminate(true);
        progressDialog.add(progressBar);

        progressDialog.setSize(300, 50);
        progressDialog.setLocationRelativeTo(parent);
        progressDialog.setDefaultCloseOperation(JDialog.DO_NOTHING_ON_CLOSE);
    }

    public void execute() {
        SwingWorker<T, Void> worker = new SwingWorker<>() {
            @Override
            protected T doInBackground() throws Exception {
                return task.call();  // Ejecutar la tarea en segundo plano
            }

            @Override
            protected void done() {
                progressDialog.dispose();  // Cerrar el diálogo
                try {
                    T result = get();  // Obtener el resultado de la tarea
                    listener.onSuccess(result);
                } catch (Exception e) {
                    listener.onError(e);  // Manejar errores
                }
            }
        };

        worker.execute();
        progressDialog.setVisible(true);  // Mostrar la barra de progreso
    }

    public interface DatabaseTaskListener<T> {
        void onSuccess(T result);  // Cuando la tarea se completa exitosamente
        void onError(Exception e);  // Cuando ocurre un error
    }
}
