import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div
            className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col items-center justify-center p-4">
            <div
                className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
                <h1 className="text-3xl font-bold text-indigo-600 mb-4">小学生数学练习工具</h1>
                <p className="text-gray-600 mb-8">欢迎使用北师版数学四年级第三单元乘法竖式练习工具</p>
                <Link
                    to="/math"
                    className="inline-flex items-center justify-center px-6 py-3 text-lg font-medium text-white bg-indigo-600 rounded-full shadow-md hover:bg-indigo-700 transition-colors duration-300">
                    <i className="fa-solid fa-calculator mr-2"></i>开始练习
                            </Link>
                <div className="mt-12 text-sm text-gray-500">
                    <></>
                </div>
            </div>
        </div>
    );
}