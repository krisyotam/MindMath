"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Operation = "+" | "-" | "*" | "/" | "^" | "√" | "log" | "sin" | "cos" | "tan" | "P" | "C"
type Difficulty = "easy" | "medium" | "hard" | "olympiad"

interface Question {
  question: string
  answer: number
}

const operations: Operation[] = ["+", "-", "*", "/", "^", "√", "log", "sin", "cos", "tan", "P", "C"]

function generateQuestion(
  difficulty: Difficulty,
  allowedOperations: Operation[],
  useNegatives: boolean,
  useDecimals: boolean
): Question {
  const operation = allowedOperations[Math.floor(Math.random() * allowedOperations.length)]
  let num1: number, num2: number, answer: number, question: string

  const getNumber = (max: number): number => {
    let num = Math.floor(Math.random() * max) + 1
    if (useNegatives && Math.random() < 0.5) num *= -1
    if (useDecimals) num += Math.random()
    return Number(num.toFixed(2))
  }

  switch (difficulty) {
    case "easy":
      num1 = getNumber(10)
      num2 = getNumber(10)
      break
    case "medium":
      num1 = getNumber(50)
      num2 = getNumber(50)
      break
    case "hard":
      num1 = getNumber(100)
      num2 = getNumber(100)
      break
    case "olympiad":
      num1 = getNumber(1000)
      num2 = getNumber(1000)
      break
  }

  switch (operation) {
    case "+":
      answer = num1 + num2
      question = `${num1} + ${num2}`
      break
    case "-":
      answer = num1 - num2
      question = `${num1} - ${num2}`
      break
    case "*":
      answer = num1 * num2
      question = `${num1} × ${num2}`
      break
    case "/":
      answer = num1
      num2 = Math.floor(Math.random() * 10) + 1
      question = `${answer * num2} ÷ ${num2}`
      break
    case "^":
      num2 = Math.floor(Math.random() * 5) + 2 // Random power between 2 and 6
      answer = Math.pow(num1, num2)
      question = `${num1}^${num2}`
      break
    case "√":
      answer = Math.sqrt(num1)
      question = `√${num1}`
      break
    case "log":
      answer = Math.log(num1) / Math.log(num2)
      question = `log${num2}(${num1})`
      break
    case "sin":
      answer = Math.sin((num1 * Math.PI) / 180)
      question = `sin(${num1}°)`
      break
    case "cos":
      answer = Math.cos((num1 * Math.PI) / 180)
      question = `cos(${num1}°)`
      break
    case "tan":
      answer = Math.tan((num1 * Math.PI) / 180)
      question = `tan(${num1}°)`
      break
    case "P":
      num2 = Math.min(num2, num1)
      answer = factorial(num1) / factorial(num1 - num2)
      question = `P(${num1}, ${num2})`
      break
    case "C":
      num2 = Math.min(num2, num1)
      answer = factorial(num1) / (factorial(num2) * factorial(num1 - num2))
      question = `C(${num1}, ${num2})`
      break
  }

  return { question, answer: Number(answer.toFixed(4)) }
}

function factorial(n: number): number {
  if (n === 0 || n === 1) return 1
  return n * factorial(n - 1)
}

export function MindMathComponent() {
  const [gameState, setGameState] = useState<"setup" | "playing" | "finished">("setup")
  const [difficulty, setDifficulty] = useState<Difficulty>("medium")
  const [questionCount, setQuestionCount] = useState(10)
  const [timeLimit, setTimeLimit] = useState(60)
  const [selectedOperations, setSelectedOperations] = useState<Operation[]>(["+", "-", "*", "/"])
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [userAnswer, setUserAnswer] = useState("")
  const [score, setScore] = useState(0)
  const [questionsAnswered, setQuestionsAnswered] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(timeLimit)
  const [useNegatives, setUseNegatives] = useState(false)
  const [useDecimals, setUseDecimals] = useState(false)
  const [speedRound, setSpeedRound] = useState(false)
  const [customTemplate, setCustomTemplate] = useState("")

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (gameState === "playing" && timeRemaining > 0) {
      timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000)
    } else if (timeRemaining === 0) {
      endGame()
    }
    return () => clearTimeout(timer)
  }, [gameState, timeRemaining])

  const startGame = () => {
    setGameState("playing")
    setScore(0)
    setQuestionsAnswered(0)
    setTimeRemaining(timeLimit)
    nextQuestion()
  }

  const nextQuestion = () => {
    if (questionsAnswered < questionCount) {
      if (customTemplate) {
        setCurrentQuestion(generateCustomQuestion(customTemplate))
      } else {
        setCurrentQuestion(generateQuestion(difficulty, selectedOperations, useNegatives, useDecimals))
      }
      setUserAnswer("")
      if (speedRound) {
        setTimeout(() => {
          submitAnswer()
        }, 5000) // 5 seconds for speed round
      }
    } else {
      endGame()
    }
  }

  const submitAnswer = () => {
    if (currentQuestion && Math.abs(parseFloat(userAnswer) - currentQuestion.answer) < 0.01) {
      setScore(score + 1)
    }
    setQuestionsAnswered(questionsAnswered + 1)
    nextQuestion()
  }

  const endGame = () => {
    setGameState("finished")
  }

  const resetGame = () => {
    setGameState("setup")
  }

  const quitGame = () => {
    setGameState("finished")
  }

  const generateCustomQuestion = (template: string): Question => {
    // Implement custom question generation based on the template
    // This is a placeholder implementation
    return { question: template, answer: 0 }
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      submitAnswer();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6 space-y-6">
        <h1 className="text-4xl font-bold text-center text-gray-800">MindMath</h1>
        {gameState === "setup" && (
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Basic Settings</TabsTrigger>
              <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="basic" className="space-y-4">
              <div>
                <Label htmlFor="difficulty">Difficulty</Label>
                <RadioGroup
                  id="difficulty"
                  value={difficulty}
                  onValueChange={(value: Difficulty) => setDifficulty(value)}
                  className="flex flex-wrap gap-4 mt-2"
                >
                  {["easy", "medium", "hard", "olympiad"].map((level) => (
                    <div key={level} className="flex items-center space-x-2">
                      <RadioGroupItem value={level} id={level} />
                      <Label htmlFor={level} className="capitalize">{level}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <div>
                <Label htmlFor="questionCount">Number of Questions: {questionCount}</Label>
                <Slider
                  id="questionCount"
                  min={5}
                  max={100}
                  step={5}
                  value={[questionCount]}
                  onValueChange={(value) => setQuestionCount(value[0])}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="timeLimit">Time Limit (seconds): {timeLimit}</Label>
                <Slider
                  id="timeLimit"
                  min={30}
                  max={600}
                  step={30}
                  value={[timeLimit]}
                  onValueChange={(value) => setTimeLimit(value[0])}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Operations</Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {operations.map((op) => (
                    <div key={op} className="flex items-center space-x-2">
                      <Switch
                        id={op}
                        checked={selectedOperations.includes(op)}
                        onCheckedChange={(checked) =>
                          setSelectedOperations(
                            checked
                              ? [...selectedOperations, op]
                              : selectedOperations.filter((o) => o !== op)
                          )
                        }
                      />
                      <Label htmlFor={op}>{op}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="advanced" className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="negatives"
                  checked={useNegatives}
                  onCheckedChange={setUseNegatives}
                />
                <Label htmlFor="negatives">Use Negative Numbers</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="decimals"
                  checked={useDecimals}
                  onCheckedChange={setUseDecimals}
                />
                <Label htmlFor="decimals">Use Decimal Numbers</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="speedRound"
                  checked={speedRound}
                  onCheckedChange={setSpeedRound}
                />
                <Label htmlFor="speedRound">Speed Round (5 seconds per question)</Label>
              </div>
              <div>
                <Label htmlFor="customTemplate">Custom Question Template</Label>
                <Input
                  id="customTemplate"
                  value={customTemplate}
                  onChange={(e) => setCustomTemplate(e.target.value)}
                  placeholder="e.g., {x} + {y} where x is [1-100] and y is [1-50]"
                  className="mt-2"
                />
              </div>
            </TabsContent>
          </Tabs>
        )}
        {gameState === "setup" && (
          <Button onClick={startGame} className="w-full" disabled={selectedOperations.length === 0}>
            Start Game
          </Button>
        )}
        {gameState === "playing" && currentQuestion && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">{currentQuestion.question}</div>
              <div className="text-sm text-gray-500">
                Question {questionsAnswered + 1} of {questionCount}
              </div>
            </div>
            <Input
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your answer"
              className="text-center text-xl"
            />
            <Button onClick={submitAnswer} className="w-full">
              Submit
            </Button>
            <div className="text-center text-sm text-gray-500">
              Time Remaining: {timeRemaining} seconds
            </div>
            <Button onClick={quitGame} variant="outline" className="w-full">
              Quit Game
            </Button>
          </div>
        )}
        {gameState === "finished" && (
          <div className="space-y-4 text-center">
            <h2 className="text-2xl font-bold">Game Over!</h2>
            <p className="text-xl">
              Your Score: {score} / {questionsAnswered}
            </p>
            <p className="text-lg">Accuracy: {((score / questionsAnswered) * 100).toFixed(2)}%</p>
            <Button onClick={resetGame} className="w-full">
              Play Again
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}