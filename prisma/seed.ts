import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create demo user
  const hashedPassword = await bcrypt.hash("password123", 12);

  const user = await prisma.user.upsert({
    where: { email: "demo@edtechy.com" },
    update: {},
    create: {
      name: "Demo Learner",
      email: "demo@edtechy.com",
      password: hashedPassword,
      streak: 5,
      xp: 750,
      lastActive: new Date(),
    },
  });

  console.log("✅ Created demo user (demo@edtechy.com / password123)");

  // Sample courses with lessons and quizzes
  const courses = [
    {
      title: "Python Programming Fundamentals",
      description: "Learn Python from scratch — variables, control flow, functions, and beyond. Perfect for beginners starting their programming journey.",
      category: "Programming",
      level: "beginner",
      duration: "8 hours",
      instructor: "Dr. Sarah Chen",
      published: true,
      lessons: [
        {
          title: "Introduction to Python",
          order: 1,
          content: `Welcome to Python! Python is a high-level, interpreted programming language known for its readability and versatility.

In this lesson, we'll cover:
1. What is Python?
2. Installing Python
3. Your first Python program
4. Basic syntax and comments

Python was created by Guido van Rossum and first released in 1991. It's named after the British comedy group Monty Python.

Key features of Python:
- Easy to read and write
- Interpreted (no compilation needed)
- Dynamically typed
- Large standard library
- Great for beginners and experts alike

Let's write your first Python program:

print("Hello, World!")

This simple line demonstrates Python's clean syntax. The print() function outputs text to the console.

Comments in Python start with the # symbol:
# This is a comment
print("This code runs")  # Inline comment`,
          quizzes: [
            {
              question: "Who created the Python programming language?",
              options: JSON.stringify(["Dennis Ritchie", "Guido van Rossum", "James Gosling", "Brendan Eich"]),
              correctAnswer: 1,
            },
            {
              question: "What symbol is used for single-line comments in Python?",
              options: JSON.stringify(["//", "/*", "#", "--"]),
              correctAnswer: 2,
            },
          ],
        },
        {
          title: "Variables and Data Types",
          order: 2,
          content: `In Python, variables are containers for storing data values. Unlike some other languages, Python is dynamically typed — you don't need to declare the type of a variable.

Basic data types in Python:
1. Integers (int): Whole numbers like 42, -7, 0
2. Floats (float): Decimal numbers like 3.14, -0.5
3. Strings (str): Text like "Hello", 'Python'
4. Booleans (bool): True or False
5. Lists: Ordered collections
6. Dictionaries: Key-value pairs

Examples:
name = "Alice"        # string
age = 25              # integer
height = 5.7          # float
is_student = True     # boolean

You can check the type of any variable using type():
print(type(name))     # <class 'str'>`,
          quizzes: [
            {
              question: "Which of these is a valid Python variable name?",
              options: JSON.stringify(["2ndPlace", "my-var", "my_var", "class"]),
              correctAnswer: 2,
            },
          ],
        },
        {
          title: "Control Flow: Conditionals",
          order: 3,
          content: `Control flow allows your program to make decisions. Python uses if, elif, and else statements for conditional logic.

Basic if statement:
if condition:
    # code to run if condition is True

Example:
age = 18
if age >= 18:
    print("You are an adult")
else:
    print("You are a minor")

You can chain conditions with elif:
score = 85
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "F"

Comparison operators: ==, !=, <, >, <=, >=
Logical operators: and, or, not`,
          quizzes: [
            {
              question: "What will this code print?\nx = 10\nif x > 5:\n    print('Big')\nelse:\n    print('Small')",
              options: JSON.stringify(["Small", "Big", "Error", "None"]),
              correctAnswer: 1,
            },
          ],
        },
        {
          title: "Loops and Iteration",
          order: 4,
          content: `Loops let you repeat code multiple times. Python has two main types: for loops and while loops.

For loops iterate over sequences:
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)

Using range():
for i in range(5):
    print(i)  # 0, 1, 2, 3, 4

While loops run as long as a condition is true:
count = 0
while count < 5:
    print(count)
    count += 1

Loop control keywords:
- break: exit the loop immediately
- continue: skip to the next iteration`,
          quizzes: [
            {
              question: "What does range(3) generate?",
              options: JSON.stringify(["[1, 2, 3]", "[0, 1, 2, 3]", "[0, 1, 2]", "[1, 2]"]),
              correctAnswer: 2,
            },
          ],
        },
        {
          title: "Functions",
          order: 5,
          content: `Functions are reusable blocks of code that perform specific tasks. They help you organize your code and avoid repetition.

Defining a function:
def greet(name):
    return f"Hello, {name}!"

Calling a function:
message = greet("Alice")
print(message)  # Hello, Alice!

Functions with multiple parameters:
def add(a, b):
    return a + b

result = add(3, 5)  # 8

Default parameters:
def greet(name="World"):
    return f"Hello, {name}!"

greet()        # Hello, World!
greet("Python") # Hello, Python!

Functions can also have no return value (they return None).`,
          quizzes: [],
        },
      ],
    },
    {
      title: "Introduction to Machine Learning",
      description: "Explore the fundamentals of machine learning — supervised learning, neural networks, and practical AI applications.",
      category: "AI & ML",
      level: "intermediate",
      duration: "12 hours",
      instructor: "Prof. James Wilson",
      published: true,
      lessons: [
        {
          title: "What is Machine Learning?",
          order: 1,
          content: `Machine Learning (ML) is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed.

Types of Machine Learning:
1. Supervised Learning: Learning from labeled data
2. Unsupervised Learning: Finding patterns in unlabeled data
3. Reinforcement Learning: Learning through trial and error

Key Concepts:
- Training data: The data used to teach the model
- Features: Input variables used for prediction
- Labels: The output we want to predict
- Model: The mathematical representation of patterns

The ML Pipeline:
1. Data Collection
2. Data Preparation
3. Model Selection
4. Training
5. Evaluation
6. Deployment

Machine learning is everywhere — from recommendation systems to self-driving cars, medical diagnosis to language translation.`,
          quizzes: [
            {
              question: "Which type of ML uses labeled training data?",
              options: JSON.stringify(["Unsupervised Learning", "Reinforcement Learning", "Supervised Learning", "Transfer Learning"]),
              correctAnswer: 2,
            },
          ],
        },
        {
          title: "Supervised Learning Algorithms",
          order: 2,
          content: `Supervised learning is the most common type of machine learning. The algorithm learns from labeled training data to make predictions.

Common algorithms:
1. Linear Regression: Predicts continuous values
2. Logistic Regression: Binary classification
3. Decision Trees: Tree-based decisions
4. Random Forest: Ensemble of decision trees
5. Support Vector Machines: Finding optimal boundaries
6. Neural Networks: Complex pattern recognition

The goal is to learn a function that maps inputs to outputs:
y = f(X)

Evaluation metrics:
- Accuracy: Correct predictions / Total predictions
- Precision: True positives / (True positives + False positives)
- Recall: True positives / (True positives + False negatives)
- F1 Score: Harmonic mean of precision and recall`,
          quizzes: [
            {
              question: "Which algorithm is best for predicting a continuous value like house prices?",
              options: JSON.stringify(["Logistic Regression", "Decision Tree", "Linear Regression", "K-Means"]),
              correctAnswer: 2,
            },
          ],
        },
        {
          title: "Neural Networks Basics",
          order: 3,
          content: `Neural networks are computing systems inspired by biological neural networks in animal brains.

A neural network consists of:
- Input layer: Receives the data
- Hidden layers: Process the information
- Output layer: Produces the result

Each connection has a weight, and each neuron has a bias. The network learns by adjusting these weights and biases.

Activation functions introduce non-linearity:
- ReLU: f(x) = max(0, x)
- Sigmoid: f(x) = 1 / (1 + e^(-x))
- Tanh: f(x) = (e^x - e^(-x)) / (e^x + e^(-x))

Deep learning uses networks with many hidden layers to learn complex patterns.`,
          quizzes: [],
        },
      ],
    },
    {
      title: "Cybersecurity Essentials",
      description: "Master the fundamentals of cybersecurity — network security, encryption, threat detection, and ethical hacking basics.",
      category: "Cybersecurity",
      level: "beginner",
      duration: "10 hours",
      instructor: "Alex Rivera, CISSP",
      published: true,
      lessons: [
        {
          title: "Security Fundamentals",
          order: 1,
          content: `Cybersecurity is the practice of protecting systems, networks, and programs from digital attacks.

The CIA Triad:
- Confidentiality: Data is accessible only to authorized parties
- Integrity: Data is accurate and hasn't been tampered with
- Availability: Systems and data are accessible when needed

Common threats:
1. Malware: Viruses, worms, trojans
2. Phishing: Social engineering attacks
3. DDoS: Distributed Denial of Service
4. Man-in-the-Middle: Intercepting communications
5. SQL Injection: Attacking databases through web forms

Security best practices:
- Strong passwords and 2FA
- Regular software updates
- Data encryption
- Network segmentation
- Principle of least privilege`,
          quizzes: [
            {
              question: "Which part of the CIA triad ensures data is only accessible to authorized users?",
              options: JSON.stringify(["Integrity", "Availability", "Confidentiality", "Authentication"]),
              correctAnswer: 2,
            },
          ],
        },
        {
          title: "Network Security",
          order: 2,
          content: `Network security protects the integrity and usability of your network and data.

Key components:
1. Firewalls: Filter traffic based on rules
2. IDS/IPS: Detect and prevent intrusions
3. VPNs: Encrypt connections over public networks
4. SSL/TLS: Secure web communications

Common protocols:
- HTTPS: HTTP over SSL/TLS
- SSH: Secure shell for remote access
- IPsec: Secure IP communications
- WPA3: Wireless network security

Port scanning and network mapping are used to discover open ports and services on a network. Understanding these helps in both defending and testing network security.`,
          quizzes: [
            {
              question: "What does a firewall do?",
              options: JSON.stringify(["Encrypts data in transit", "Filters network traffic based on rules", "Detects malware on endpoints", "Manages user passwords"]),
              correctAnswer: 1,
            },
          ],
        },
        {
          title: "Cryptography Basics",
          order: 3,
          content: `Cryptography is the practice of secure communication through encoding.

Types of encryption:
1. Symmetric: Same key for encryption and decryption (AES, DES)
2. Asymmetric: Public/private key pairs (RSA, ECC)

Hashing vs Encryption:
- Hashing: One-way function, cannot be reversed (SHA-256)
- Encryption: Two-way, can be decrypted with the key

Digital signatures verify authenticity:
1. Sign with private key
2. Verify with public key

Common use cases:
- HTTPS certificates
- Password storage (hashing + salting)
- Digital signatures
- Secure messaging`,
          quizzes: [],
        },
      ],
    },
    {
      title: "Data Science with Python",
      description: "Learn data analysis, visualization, and statistical modeling using Python's powerful data science ecosystem.",
      category: "Data Science",
      level: "intermediate",
      duration: "15 hours",
      instructor: "Dr. Maria Torres",
      published: true,
      lessons: [
        {
          title: "Introduction to Data Science",
          order: 1,
          content: `Data science combines statistics, programming, and domain knowledge to extract insights from data.

The Data Science Process:
1. Ask questions and define goals
2. Collect and gather data
3. Clean and prepare data
4. Explore and analyze data
5. Model and predict
6. Communicate results

Tools of the trade:
- Python: Primary programming language
- Pandas: Data manipulation
- NumPy: Numerical computing
- Matplotlib/Seaborn: Visualization
- Scikit-learn: Machine learning
- Jupyter: Interactive notebooks

Data comes in many forms: structured (tables), semi-structured (JSON, XML), and unstructured (text, images).`,
          quizzes: [
            {
              question: "Which Python library is primarily used for data manipulation and analysis?",
              options: JSON.stringify(["NumPy", "Pandas", "Matplotlib", "Scikit-learn"]),
              correctAnswer: 1,
            },
          ],
        },
        {
          title: "Data Visualization",
          order: 2,
          content: `Data visualization helps communicate insights effectively. A good visualization can reveal patterns that statistics alone might miss.

Types of plots:
- Line plots: Trends over time
- Bar charts: Comparing categories
- Scatter plots: Relationships between variables
- Histograms: Distribution of data
- Box plots: Statistical summaries
- Heatmaps: Correlation matrices

Best practices:
- Choose the right chart type for your data
- Keep it simple and focused
- Use color meaningfully
- Label axes clearly
- Include context and annotations

Python libraries for visualization:
import matplotlib.pyplot as plt
import seaborn as sns

plt.figure(figsize=(10, 6))
sns.scatterplot(data=df, x='feature1', y='feature2')`,
          quizzes: [],
        },
      ],
    },
    {
      title: "Cloud Computing with AWS",
      description: "Get started with cloud computing using AWS — EC2, S3, Lambda, and core cloud architecture patterns.",
      category: "Cloud",
      level: "beginner",
      duration: "8 hours",
      instructor: "Priya Patel, AWS Solutions Architect",
      published: true,
      lessons: [
        {
          title: "Cloud Computing Overview",
          order: 1,
          content: `Cloud computing delivers computing services over the internet, eliminating the need for physical infrastructure.

Service Models:
- IaaS: Infrastructure (virtual machines, storage)
- PaaS: Platform (managed runtime environments)
- SaaS: Software (applications over the web)

Deployment Models:
- Public Cloud: Shared infrastructure
- Private Cloud: Dedicated infrastructure
- Hybrid Cloud: Mix of public and private

Benefits:
- Pay-as-you-go pricing
- Elastic scalability
- Global reach
- Managed services
- High availability

AWS offers over 200 services, from compute and storage to machine learning and analytics.`,
          quizzes: [
            {
              question: "Which AWS service model provides virtual machines and storage?",
              options: JSON.stringify(["SaaS", "PaaS", "IaaS", "FaaS"]),
              correctAnswer: 2,
            },
          ],
        },
        {
          title: "AWS Core Services",
          order: 2,
          content: `Amazon Web Services offers a wide range of core services:

Compute:
- EC2: Virtual machines
- Lambda: Serverless functions
- ECS/EKS: Container orchestration

Storage:
- S3: Object storage
- EBS: Block storage
- RDS: Managed databases

Networking:
- VPC: Virtual private cloud
- CloudFront: CDN
- Route 53: DNS service

Best practices:
- Use IAM roles instead of access keys
- Enable encryption at rest and in transit
- Set up monitoring with CloudWatch
- Implement auto-scaling for variable workloads`,
          quizzes: [],
        },
      ],
    },
  ];

  // Create courses with lessons and quizzes
  for (const courseData of courses) {
    const { lessons, ...courseInfo } = courseData;

    const course = await prisma.course.upsert({
      where: { id: courseData.title.toLowerCase().replace(/\s+/g, "-") },
      update: {},
      create: {
        id: courseData.title.toLowerCase().replace(/\s+/g, "-"),
        ...courseInfo,
      },
    });

    for (let i = 0; i < lessons.length; i++) {
      const { quizzes, ...lessonInfo } = lessons[i];

      const lesson = await prisma.lesson.upsert({
        where: { id: `${course.id}-lesson-${lessonInfo.order}` },
        update: {},
        create: {
          id: `${course.id}-lesson-${lessonInfo.order}`,
          courseId: course.id,
          ...lessonInfo,
        },
      });

      for (const quizData of quizzes) {
        await prisma.quiz.create({
          data: {
            lessonId: lesson.id,
            ...quizData,
          },
        });
      }
    }

    console.log(`✅ Created course: ${course.title}`);
  }

  // Enroll demo user in Python course
  const pythonCourse = await prisma.course.findFirst({
    where: { title: "Python Programming Fundamentals" },
  });

  if (pythonCourse) {
    await prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: pythonCourse.id,
        },
      },
      update: {},
      create: {
        userId: user.id,
        courseId: pythonCourse.id,
        progress: 40,
      },
    });
  }

  // Create sample achievements for demo user
  const achievementTypes = [
    { type: "first_course", title: "First Steps", description: "Enrolled in your first course", icon: "🎯" },
    { type: "streak_3", title: "Getting Started", description: "Maintained a 3-day streak", icon: "🔥" },
    { type: "chat_10", title: "Curious Mind", description: "Sent 10 messages to the AI tutor", icon: "💡" },
  ];

  for (const ach of achievementTypes) {
    await prisma.achievement.upsert({
      where: { id: `${user.id}-${ach.type}` },
      update: {},
      create: {
        id: `${user.id}-${ach.type}`,
        userId: user.id,
        ...ach,
      },
    });
  }

  // Create sample chat messages
  const chatMessages = [
    { role: "user", content: "Can you explain how Python lists work?" },
    { role: "assistant", content: "Sure! Python lists are ordered, mutable collections that can hold items of different types. You create them with square brackets: `my_list = [1, 2, 3]`. Lists support indexing, slicing, and various methods like `append()`, `remove()`, and `sort()`. They're one of the most versatile data structures in Python!" },
    { role: "user", content: "What's the difference between a list and a tuple?" },
    { role: "assistant", content: "Great question! The main difference is mutability. Lists are mutable (can be changed after creation) while tuples are immutable (cannot be changed). Tuples use parentheses: `my_tuple = (1, 2, 3)`. Use tuples when you want to ensure data doesn't change, and lists when you need flexibility." },
  ];

  for (const msg of chatMessages) {
    await prisma.chatMessage.create({
      data: {
        userId: user.id,
        role: msg.role,
        content: msg.content,
        createdAt: new Date(Date.now() - Math.random() * 86400000 * 7),
      },
    });
  }

  // Create sample notifications
  const notifications = [
    { title: "Welcome to Edtechy!", message: "Start your learning journey by exploring our courses.", type: "info" },
    { title: "Achievement Unlocked", message: "You earned the 'First Steps' achievement!", type: "achievement" },
    { title: "New Course Available", message: "Check out our new 'Cloud Computing with AWS' course.", type: "course" },
    { title: "Streak Alert", message: "You're on a 5-day streak! Keep it going!", type: "success" },
    { title: "Quiz Completed", message: "You scored 100% on the Python Variables quiz!", type: "success" },
  ];

  for (const notif of notifications) {
    await prisma.notification.create({
      data: {
        userId: user.id,
        ...notif,
      },
    });
  }

  // Create sample quiz results
  const quizzes = await prisma.quiz.findMany({ take: 3 });
  for (const quiz of quizzes) {
    await prisma.quizResult.upsert({
      where: {
        userId_quizId: {
          userId: user.id,
          quizId: quiz.id,
        },
      },
      update: {},
      create: {
        userId: user.id,
        quizId: quiz.id,
        score: 1,
        total: 1,
      },
    });
  }

  console.log("✅ Sample notifications created");
  console.log("✅ Sample chat messages created");
  console.log("✅ Sample quiz results created");
  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
