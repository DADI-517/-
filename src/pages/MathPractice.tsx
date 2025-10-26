import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useTheme } from "@/hooks/useTheme";

const generateNumbers = (customMultiplicand?: number, customMultiplier?: number) => {
    const multiplicand = customMultiplicand || Math.floor(Math.random() * 900) + 100;
    const multiplier = customMultiplier || Math.floor(Math.random() * 90) + 10;
    const result = multiplicand * multiplier;
    const multiplierOnes = multiplier % 10;
    const multiplierTens = Math.floor(multiplier / 10);
    const step1 = multiplicand * multiplierOnes;
    const step2 = multiplicand * multiplierTens;

    return {
        multiplicand,
        multiplier,
        result,
        steps: [step1, step2]
    };
};

const formatNumber = (num: number): string[] => {
    return num.toString().split("");
};

const calculateGridCount = (
    multiplicand: number,
    multiplier: number,
    step1: number,
    step2: number,
    result: number
): {
    rows: number;
    cols: number;
} => {
    const multiplicandStr = multiplicand.toString();
    const multiplierStr = multiplier.toString();
    const step1Str = step1.toString();
    const step2Str = step2.toString();
    const resultStr = result.toString();

    const maxLength = Math.max(
        multiplicandStr.length,
        multiplierStr.length,
        step1Str.length,
        step2Str.length,
        resultStr.length
    );

    const rows = 3 + (multiplierStr.length > 1 ? 2 : 1);
    const cols = maxLength + 2;

    return {
        rows,
        cols
    };
};

const getCorrectDigit = (
    answerIndex: number,
    step1Digits: string[],
    step2Digits: string[],
    resultDigits: string[],
    cols: number
): string => {
    if (answerIndex < cols) {
        const positionFromRight = cols - 1 - answerIndex;
        const digitIndex = step1Digits.length - 1 - positionFromRight;

        if (digitIndex >= 0 && digitIndex < step1Digits.length) {
            return step1Digits[digitIndex];
        }

        return "";
    }

    const step2StartIndex = cols;

    if (answerIndex < step2StartIndex + cols) {
        const positionFromRight = cols - 1 - (answerIndex - step2StartIndex) - 1;
        const digitIndex = step2Digits.length - 1 - positionFromRight;

        if (digitIndex >= 0 && digitIndex < step2Digits.length) {
            return step2Digits[digitIndex];
        }

        return "";
    }

    const resultStartIndex = step2StartIndex + cols;

    if (answerIndex < resultStartIndex + cols) {
        const positionFromRight = cols - 1 - (answerIndex - resultStartIndex);
        const digitIndex = resultDigits.length - 1 - positionFromRight;

        if (digitIndex >= 0 && digitIndex < resultDigits.length) {
            return resultDigits[digitIndex];
        }

        return "";
    }

    return "";
};

const shouldHaveCorrectDigit = (
    answerIndex: number,
    step1Digits: string[],
    step2Digits: string[],
    resultDigits: string[],
    cols: number
): boolean => {
    if (answerIndex < cols) {
        const positionFromRight = cols - 1 - answerIndex;
        const digitIndex = step1Digits.length - 1 - positionFromRight;
        return digitIndex >= 0 && digitIndex < step1Digits.length;
    }

    const step2StartIndex = cols;

    if (answerIndex < step2StartIndex + cols) {
        const positionFromRight = cols - 1 - (answerIndex - step2StartIndex) - 1;
        const digitIndex = step2Digits.length - 1 - positionFromRight;
        return digitIndex >= 0 && digitIndex < step2Digits.length;
    }

    const resultStartIndex = step2StartIndex + cols;

    if (answerIndex < resultStartIndex + cols) {
        const positionFromRight = cols - 1 - (answerIndex - resultStartIndex);
        const digitIndex = resultDigits.length - 1 - positionFromRight;
        return digitIndex >= 0 && digitIndex < resultDigits.length;
    }

    return false;
};

export default function MathPractice() {
    const [problem, setProblem] = useState(() => generateNumbers());
    const [userAnswers, setUserAnswers] = useState<string[]>([]);
    const [isChecking, setIsChecking] = useState(false);

    const [feedback, setFeedback] = useState<{
        [key: string]: boolean;
    }>({});

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const {
        theme
    } = useTheme();

    const [customMultiplicand, setCustomMultiplicand] = useState<string>("");
    const [customMultiplier, setCustomMultiplier] = useState<string>("");
    const [inputError, setInputError] = useState<string>("");
    const multiplicandDigits = formatNumber(problem.multiplicand);
    const multiplierDigits = formatNumber(problem.multiplier);
    const step1Digits = formatNumber(problem.steps[0]);
    const step2Digits = formatNumber(problem.steps[1]);
    const resultDigits = formatNumber(problem.result);

    const {
        rows,
        cols
    } = calculateGridCount(
        problem.multiplicand,
        problem.multiplier,
        problem.steps[0],
        problem.steps[1],
        problem.result
    );

    useEffect(() => {
        const totalInputs = cols + (multiplierDigits.length > 1 ? cols : 0) + cols;
        setUserAnswers(Array(totalInputs).fill(""));
        setFeedback({});
        setIsChecking(false);
        inputRefs.current = [];

        setTimeout(() => {
            if (inputRefs.current.length > 0) {
                inputRefs.current[0]?.focus();
            }
        }, 100);
    }, [problem]);

    const handleInputChange = (index: number, value: string) => {
        if (value && !/^\d$/.test(value))
            return;

        const newAnswers = [...userAnswers];
        newAnswers[index] = value;
        setUserAnswers(newAnswers);

        if (value) {
            const correctDigit = getCorrectDigit(index, step1Digits, step2Digits, resultDigits, cols);
            const shouldHaveDigit = shouldHaveCorrectDigit(index, step1Digits, step2Digits, resultDigits, cols);

            if (shouldHaveDigit) {
                const isCorrect = value === correctDigit;

                const newFeedback = {
                    ...feedback,
                    [index]: isCorrect
                };

                setFeedback(newFeedback);

                if (!isCorrect) {
                    toast.error("这个数字不正确，请再试一次", {
                        duration: 2000,
                        position: "top-center"
                    });
                }
            } else {
                if (feedback[index] !== undefined) {
                    const newFeedback = {
                        ...feedback
                    };

                    delete newFeedback[index];
                    setFeedback(newFeedback);
                }
            }
        } else {
            if (feedback[index] !== undefined) {
                const newFeedback = {
                    ...feedback
                };

                delete newFeedback[index];
                setFeedback(newFeedback);
            }
        }

        if (value && index < userAnswers.length - 1 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const checkAnswers = () => {
        const allRequiredFilled = userAnswers.every((answer, index) => {
            const shouldHaveDigit = shouldHaveCorrectDigit(index, step1Digits, step2Digits, resultDigits, cols);
            return !shouldHaveDigit || answer !== "";
        });

        if (!allRequiredFilled) {
            toast.warning("请填写所有答案后再检查");
            return;
        }

        setIsChecking(true);

        const newFeedback: {
            [key: string]: boolean;
        } = {};

        let isCorrect = true;

        for (let i = 0; i < userAnswers.length; i++) {
            const correctDigit = getCorrectDigit(i, step1Digits, step2Digits, resultDigits, cols);
            const shouldHaveDigit = shouldHaveCorrectDigit(i, step1Digits, step2Digits, resultDigits, cols);

            if (shouldHaveDigit) {
                const answerCorrect = userAnswers[i] === correctDigit;
                newFeedback[i] = answerCorrect;

                if (!answerCorrect)
                    isCorrect = false;
            }
        }

        setFeedback(newFeedback);

        if (isCorrect) {
            toast.success("太棒了！所有计算都正确！");
        } else {
            toast.error("有些地方出错了，请仔细检查后重试");
        }
    };

    const generateNewProblem = () => {
        setProblem(generateNumbers());
    };

    const validateUserInput = (multiplicandStr: string, multiplierStr: string): {
        isValid: boolean;
        message: string;
    } => {
        if (!multiplicandStr || !multiplierStr) {
            return {
                isValid: false,
                message: "请输入被乘数和乘数"
            };
        }

        if (!/^\d+$/.test(multiplicandStr) || !/^\d+$/.test(multiplierStr)) {
            return {
                isValid: false,
                message: "请输入有效的数字"
            };
        }

        const multiplicand = parseInt(multiplicandStr);
        const multiplier = parseInt(multiplierStr);

        if (multiplicand < 100 || multiplicand > 999) {
            return {
                isValid: false,
                message: "被乘数必须是三位数（100-999）"
            };
        }

        if (multiplier < 10 || multiplier > 99) {
            return {
                isValid: false,
                message: "乘数必须是两位数（10-99）"
            };
        }

        return {
            isValid: true,
            message: ""
        };
    };

    const generateCustomProblem = () => {
        const validation = validateUserInput(customMultiplicand, customMultiplier);

        if (!validation.isValid) {
            setInputError(validation.message);
            toast.error(validation.message);
            return;
        }

        setInputError("");
        setProblem(generateNumbers(parseInt(customMultiplicand), parseInt(customMultiplier)));
        toast.success(`已生成 ${customMultiplicand} × ${customMultiplier} 的乘法竖式`);
    };

    const fillCorrectAnswers = () => {
        const correctAnswers = [];

        const correctFeedback: {
            [key: string]: boolean;
        } = {};

        for (let i = 0; i < userAnswers.length; i++) {
            const correctDigit = getCorrectDigit(i, step1Digits, step2Digits, resultDigits, cols);
            const shouldHaveDigit = shouldHaveCorrectDigit(i, step1Digits, step2Digits, resultDigits, cols);

            if (shouldHaveDigit) {
                correctAnswers[i] = correctDigit;
                correctFeedback[i] = true;
            } else {
                correctAnswers[i] = "";
            }
        }

        setUserAnswers(correctAnswers);
        setFeedback(correctFeedback);

        toast.info("已自动填充正确答案", {
            duration: 3000,
            position: "top-center"
        });
    };

    const renderInputBox = (answerIndex: number, rowType: "step1" | "step2" | "result") => {
        const hasFeedback = feedback[answerIndex] !== undefined;
        const isCorrect = feedback[answerIndex];
        const shouldHaveDigit = shouldHaveCorrectDigit(answerIndex, step1Digits, step2Digits, resultDigits, cols);

        return (
            <div className="w-full h-full flex flex-col items-center">
                {}
                <input
                    key={`input-${answerIndex}`}
                    ref={el => inputRefs.current[answerIndex] = el}
                    type="text"
                    maxLength={1}
                    value={userAnswers[answerIndex] || ""}
                    onChange={e => handleInputChange(answerIndex, e.target.value)}
                    className={`w-full h-full text-center text-xl font-medium border-none outline-none cursor-text transition-all duration-200 ${hasFeedback ? isCorrect ? "text-green-500 bg-green-50 dark:bg-green-900/20" : "text-red-500 bg-red-50 dark:bg-red-900/20" : theme === "dark" ? "text-white" : "text-black"} focus:bg-blue-100 dark:focus:bg-blue-900/30 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600`}
                    inputMode="numeric"
                    pattern="[0-9]"
                    autoComplete="off"
                    spellCheck="false" />
            </div>
        );
    };

    const renderCalculationGrid = () => {
        const gridItems = [];
        let answerIndex = 0;

        for (let j = 0; j < cols; j++) {
            const startColForMultiplicand = cols - multiplicandDigits.length;
            const digitIndex = j - startColForMultiplicand;
            const digit = digitIndex >= 0 && digitIndex < multiplicandDigits.length ? multiplicandDigits[digitIndex] : "";

            gridItems.push(<div
                key={`row1-col${j}`}
                className={`border border-gray-300 flex items-center justify-center h-16 text-lg font-medium ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white"}`}>
                {digit}
            </div>);
        }

        for (let j = 0; j < cols; j++) {
            const isFirstCol = j === 0;
            const startColForMultiplier = cols - multiplierDigits.length;
            const digitIndex = j - startColForMultiplier;
            const digit = isFirstCol ? "×" : digitIndex >= 0 && digitIndex < multiplierDigits.length ? multiplierDigits[digitIndex] : "";

            gridItems.push(<div
                key={`row2-col${j}`}
                className={`border border-gray-300 flex items-center justify-center h-16 text-lg font-medium ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white"}`}>
                {digit}
            </div>);
        }

        for (let j = 0; j < cols; j++) {
            gridItems.push(<div
                key={`row3-col${j}`}
                className={`border-t-2 border-b border-gray-300 flex items-center justify-center h-3 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
                {j === 0 && <div className="border-t-2 border-gray-300 w-full h-0"></div>}
            </div>);
        }

        for (let j = 0; j < cols; j++) {
            const isInputPosition = true;

            gridItems.push(<div
                key={`row4-col${j}`}
                className={`border border-gray-300 flex items-center justify-center h-16 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
                {isInputPosition ? renderInputBox(answerIndex, "step1") : ""}
            </div>);

            if (isInputPosition)
                answerIndex++;
        }

        if (multiplierDigits.length > 1) {
            for (let j = 0; j < cols; j++) {
                const isInputPosition = true;

                gridItems.push(<div
                    key={`row5-col${j}`}
                    className={`border border-gray-300 flex items-center justify-center h-16 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
                    {isInputPosition ? renderInputBox(answerIndex, "step2") : ""}
                </div>);

                if (isInputPosition)
                    answerIndex++;
            }

            for (let j = 0; j < cols; j++) {
                gridItems.push(<div
                    key={`row6-col${j}`}
                    className={`border-t-2 border-b border-gray-300 flex items-center justify-center h-3 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
                    {j === 0 && <div className="border-t-2 border-gray-300 w-full h-0"></div>}
                </div>);
            }
        }

        for (let j = 0; j < cols; j++) {
            const isInputPosition = true;

            gridItems.push(<div
                key={`row${multiplierDigits.length > 1 ? "7" : "6"}-col${j}`}
                className={`border border-gray-300 flex items-center justify-center h-16 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
                {isInputPosition ? renderInputBox(answerIndex, "result") : ""}
            </div>);

            if (isInputPosition)
                answerIndex++;
        }

        return gridItems;
    };

    return (
        <div
            className={`min-h-screen p-4 flex flex-col items-center ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gradient-to-br from-blue-50 to-purple-50"}`}>
            <div className="max-w-2xl w-full mx-auto">
                <header className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-indigo-600 mb-2">三位数与两位数乘法竖式计算练习</h1>
                    <></>
                </header>
                {}
                <div
                    className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} rounded-2xl shadow-lg p-6 mb-8`}>
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                        <i className="fa-solid fa-keyboard text-blue-500 mr-2"></i>自定义乘法算式
                                                                                  </h2>
                    <div className="flex flex-col sm:flex-row gap-4 items-center mb-4">
                        <input
                            type="text"
                            value={customMultiplicand}
                            onChange={e => setCustomMultiplicand(e.target.value)}
                            placeholder="被乘数（100-999）"
                            className={`px-4 py-2 border rounded-lg w-full sm:w-1/3 ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500" : "bg-white border-gray-300 focus:border-blue-500"} focus:outline-none focus:ring-2 focus:ring-blue-400`}
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={3} />
                        <span className="text-xl font-bold">×</span>
                        <input
                            type="text"
                            value={customMultiplier}
                            onChange={e => setCustomMultiplier(e.target.value)}
                            placeholder="乘数（10-99）"
                            className={`px-4 py-2 border rounded-lg w-full sm:w-1/3 ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500" : "bg-white border-gray-300 focus:border-blue-500"} focus:outline-none focus:ring-2 focus:ring-blue-400`}
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={2} />
                        <button
                            onClick={generateCustomProblem}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium shadow-md hover:bg-blue-700 transition-colors duration-300 flex-1 sm:flex-none whitespace-nowrap">
                            <i className="fa-solid fa-calculator mr-2"></i>生成竖式
                                                                                                </button>
                    </div>
                    {inputError && <div className="text-red-500 text-sm flex items-center">
                        <i className="fa-solid fa-exclamation-circle mr-1"></i>
                        {inputError}
                    </div>}
                </div>
                <main
                    className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} rounded-2xl shadow-lg p-6 mb-8`}>
                    <div className="mb-6">
                        <div
                            className="grid gap-0"
                            style={{
                                gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                                gridTemplateRows: `repeat(${rows}, auto)`
                            }}>
                            {renderCalculationGrid()}
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={checkAnswers}
                            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium shadow-md hover:bg-indigo-700 transition-colors duration-300 flex items-center justify-center">
                            <i className="fa-solid fa-check-circle mr-2"></i>检查答案
                                                                                                </button>
                        <button
                            onClick={generateNewProblem}
                            className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium shadow-md hover:bg-green-700 transition-colors duration-300 flex items-center justify-center">
                            <i className="fa-solid fa-refresh mr-2"></i>新题目
                                                                                                </button>
                        <button
                            onClick={fillCorrectAnswers}
                            className="px-6 py-3 bg-amber-500 text-white rounded-lg font-medium shadow-md hover:bg-amber-600 transition-colors duration-300 flex items-center justify-center">
                            <i className="fa-solid fa-magic mr-2"></i>显示答案
                                                                                                </button>
                    </div>
                </main>
                <div
                    className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} rounded-2xl shadow-lg p-6 mb-8`}
                    style={{
                        backgroundColor: "#A7F3D0"
                    }}>
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                        <i className="fa-solid fa-lightbulb text-yellow-500 mr-2"></i>学习提示
                                                                                  </h2>
                    <ul
                        className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                        <li>从右往左填写数字（从个位开始）</li>
                        <li>先计算个位数与三位数的乘积，确保个位对齐个位</li>
                        <li>再计算十位数与三位数的乘积，结果需向左移一位，确保十位对齐十位</li>
                        <li>注意乘法过程中的进位</li>
                        <li>最后将两个乘积相加得到最终结果</li>
                        <li>输入数字显绿色代表正确，红色代表错误，黑色代表此格不用填写</li>
                        <li>遇到困难时，可以点击"显示答案"按钮查看正确解法</li>
                    </ul>
                </div>
            </div>
            <footer className="mt-auto py-4 text-center text-gray-500 text-sm">
                <p>小学生数学学习工具 © {new Date().getFullYear()}</p>
            </footer>
        </div>
    );
}