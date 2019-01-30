package lexer;


public class Token {
    String type;
    Object value;

    public Token(String type, Object value){
        this.type = type;
        this.value = value;
    }

}