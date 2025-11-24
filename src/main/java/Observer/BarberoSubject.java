package Observer;

import javax.swing.*;
import java.util.ArrayList;
import java.util.List;

public class BarberoSubject {
    private final List<BarberoObserver> observers = new ArrayList<>();

    public void addObserver(BarberoObserver observer) {
        observers.add(observer);
    }

    public void removeObserver(BarberoObserver observer) {
        observers.remove(observer);
    }

    public void notifyObservers(List<String> listaDeBarberos) {


        for (BarberoObserver observer : observers) {
            observer.update(listaDeBarberos);
        }
    }

}



