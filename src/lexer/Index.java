package lexer;

import java.util.*;
import java.util.regex.Pattern;

public class Index {
    private HashMap<String, String> KEYWORDS = new HashMap<String, String>() {{
        put("func", "FUNCTION");
        put("fun", "FUNCTION");
        put("if", "IF");
        put("else", "ELSE");
        put("true", "BOOLEAN");
        put("false", "BOOLEAN");
        put("while", "WHILE");
        put("for", "FOR");
        put("times", "TIMES");
        put("import", "IMPORT");
    }};
    public ArrayList<Token> Run (String string){
        int i = 0;
        ArrayList<Token> tokens = new ArrayList<Token>();
        tokens.add(new Token( "{",  "{"));

        while (i < string.length()){
            char character = string.charAt(i);

            if (character == ' ' || character == '\t' || character == '\n') {
                if (character == '\n') {
                    tokens.add(new Token("\n", "\n"));
                }
                while (i < string.length() && (string.charAt(i) == ' ' || string.charAt(i) == '\t' || string.charAt(i) == '\n')) {
                    i++;
                }
                continue;
            }
            if (IsDigit(character)) {
                String a = "";
                while (i < string.length() && (IsDigit(string.charAt(i)))) {
                    a += string.charAt(i);
                    i++;
                }
                if (i < string.length() && (string.charAt(i) == '.')) {
                    a += string.charAt(i);
                    i++;
                    while (i < string.length() && (IsDigit(string.charAt(i)))) {
                        a += string.charAt(i);
                        i++;
                    }
                    tokens.add(new Token("NUMBER", Float.parseFloat(a)));
                } else {
                    tokens.add(new Token("NUMBER", Integer.parseInt(a)));
                }
                continue;
            }
            if (Pattern.compile("([a-zA-Z])").matcher(Character.toString(character)).find()) {
                String a = "";
                while (i < string.length() && (Pattern.compile("([a-zA-Z])").matcher(Character.toString(string.charAt(i))).find() || IsDigit(string.charAt(i)) || string.charAt(i) == '_')) {
                    a += string.charAt(i);
                    i++;
                }
                if (KEYWORDS.containsKey(a)) {
                    tokens.add(new Token(KEYWORDS.get(a), a));
                } else {
                    tokens.add(new Token("ID", a));
                }
                continue;
            }
            if (character == '>' && string.charAt(i + 1) == '=') {
                i++;
                i++;
                tokens.add(new Token(">=", ">="));
                continue;
            }
            if (character == '<' && string.charAt(i + 1) == '=') {
                i++;
                i++;
                tokens.add(new Token("<=", "<="));
                continue;
            }
            if (character == '!' && string.charAt(i + 1) == '=') {
                i++;
                i++;
                tokens.add(new Token("!=", "!="));
                continue;
            }
            if (character == '|' && string.charAt(i + 1) == '|') {
                i++;
                i++;
                tokens.add(new Token("||", "||"));
                continue;
            }
            if (character == '/' && string.charAt(i + 1) == '/') {
                while (i < string.length() && (string.charAt(i) != '\n')) {
                    i++;
                }
                continue;
            }
            if (character == '/' && string.charAt(i + 1) == '*') {
                while (i < string.length() &&(string.charAt(i - 2) != '*' || string.charAt(i - 1) != '/')) {
                    i++;
                }
                continue;
            }
            if (character == ':' && string.charAt(i + 1) == '=') {
                i++;
                i++;
                tokens.add(new Token(":=", ":="));
                continue;
            }
            if (character == '=' && string.charAt(i + 1) == '=') {
                i++;
                i++;
                tokens.add(new Token("==", "=="));
                continue;
            }
            if (character == '&' && string.charAt(i + 1) == '&') {
                i++;
                i++;
                tokens.add(new Token("&&", "&&"));
                continue;
            }
            if (character == '=') {
                tokens.add(new Token("=", character));
                i++;
                continue;
            }
            if (character == '>') {
                tokens.add(new Token(">", character));
                i++;
                continue;
            }
            if (character == '<') {
                tokens.add(new Token("<", character));
                i++;
                continue;
            }
            if (character == '+') {
                tokens.add(new Token("+", character));
                i++;
                continue;
            }
            if (character == '-') {
                tokens.add(new Token("-", character));
                i++;
                continue;
            }
            if (character == '*') {
                tokens.add(new Token("*", character));
                i++;
                continue;
            }
            if (character == '/') {
                tokens.add(new Token("/", character));
                i++;
                continue;
            }
            if (character == '(') {
                tokens.add(new Token("(", character));
                i++;
                continue;
            }
            if (character == ')') {
                tokens.add(new Token(")", character));
                i++;
                continue;
            }
            if (character == '[') {
                tokens.add(new Token("[", character));
                i++;
                continue;
            }
            if (character == ']') {
                tokens.add(new Token("]", character));
                i++;
                continue;
            }
            if (character == '{') {
                tokens.add(new Token("{", character));
                i++;
                continue;
            }
            if (character == '}') {
                tokens.add(new Token("}", character));
                i++;
                continue;
            }
            if (character == '.') {
                tokens.add(new Token(".", character));
                i++;
                continue;
            }
            if (character == ',') {
                tokens.add(new Token(",", character));
                i++;
                continue;
            }
            if (character == ':') {
                tokens.add(new Token(":", character));
                i++;
                continue;
            }
            if (character == ';') {
                tokens.add(new Token(";", character));
                i++;
                continue;
            }
            if (character == '\'' || character == '\"') {
                i++;
                String a = "";
                while (!((string.charAt(i) == '\'' || string.charAt(i) == '"') && (string.charAt(i - 1) != '\\')) || string.charAt(i - 1) != '\n') {
                    a += string.charAt(i);
                    i++;
                }
                i++;
                if (a.endsWith("\n")) {
                    throw new Error("Error: Didn\'t close string.");
                }
                a = a.replaceAll("\\\'", "\'");
                a = a.replaceAll("\\\"", "\"");
                a = a.replaceAll("\\n", "\n");
                tokens.add(new Token("STRING", a));
                continue;
            }

        }
        tokens.add(new Token("}", "}"));
        tokens.add(new Token("None", null));
        return tokens;

    }
    boolean  IsDigit(char a){
        return Pattern.compile("([0-9])").matcher(Character.toString(a)).find();
    }

}
