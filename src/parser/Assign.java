package parser;

public class Assign {
    String name;
    Object left, op, right, token;

    public Assign(Object left, Object op, Object right){
        this.left = left;
        this.name = "Array";
        this.op = this.token = op;
        this.right = right;
        this.name = "Assign";
    }
}
