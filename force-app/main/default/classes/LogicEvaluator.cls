public class LogicEvaluator {
    public static Boolean evaluate(String strLogic, Map<String, Boolean> mapLogic) {
        // 替换逻辑运算符和变量
        strLogic = strLogic.replace('or', '||').replace('and', '&&');

        // 替换变量为其对应的布尔值
        for (String key : mapLogic.keySet()) {
            strLogic = strLogic.replace(key, String.valueOf(mapLogic.get(key)));
        }

        // 计算和返回结果
        return evaluateBooleanExpression(strLogic);
    }

    private static Boolean evaluateBooleanExpression(String expression) {
        // 这里我们使用一个简单的表达式解析方式
        // 注意：Apex 中没有 eval()，所以我们需要手动解析
        // 下面是一个简单的解析实现
        // 你可以根据需要扩展这个逻辑解析器

        // 这个示例只处理简单的布尔表达式
        // 复杂逻辑可能需要更复杂的解析
        if (expression.contains('&&')) {
            List<String> parts = expression.split('&&');
            for (String part : parts) {
                if (!evaluateBooleanExpression(part.trim())) {
                    return false;
                }
            }
            return true;
        } else if (expression.contains('||')) {
            List<String> parts = expression.split('\\|\\|');
            for (String part : parts) {
                if (evaluateBooleanExpression(part.trim())) {
                    return true;
                }
            }
            return false;
        } else {
            return Boolean.valueOf(expression);
        }
    }
}
