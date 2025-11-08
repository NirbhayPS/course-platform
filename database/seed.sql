-- ML Course Platform Seed Data
-- This script populates the database with initial course content

-- Clear existing data (in dependency order)
DELETE FROM user_projects;
DELETE FROM user_module_progress;
DELETE FROM answers;
DELETE FROM questions;
DELETE FROM checkpoints;
DELETE FROM modules;
DELETE FROM users;

-- Reset sequences
ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE modules_id_seq RESTART WITH 1;
ALTER SEQUENCE checkpoints_id_seq RESTART WITH 1;
ALTER SEQUENCE questions_id_seq RESTART WITH 1;
ALTER SEQUENCE answers_id_seq RESTART WITH 1;
ALTER SEQUENCE user_module_progress_id_seq RESTART WITH 1;
ALTER SEQUENCE user_projects_id_seq RESTART WITH 1;

-- Insert Module 0: Introduction to Machine Learning
INSERT INTO modules (module_number, title, philosophy, description) VALUES
(0, 'Introduction to Machine Learning', 
 'Machine learning is not magic—it''s a systematic approach to finding patterns in data. Before diving into complex algorithms, we must understand the fundamental concepts, terminology, and problem-solving frameworks that underpin all ML applications.',
 'This introductory module establishes the foundation for your ML engineering journey by covering core concepts, types of learning, and the ML workflow.');

-- Insert Module 1: Data and Statistics Fundamentals  
INSERT INTO modules (module_number, title, philosophy, description) VALUES
(1, 'Data and Statistics Fundamentals',
 'Data is the fuel of machine learning, but raw data is rarely ready for algorithms. Understanding how to explore, clean, and statistically analyze data is crucial before applying any ML techniques. Statistics provides the mathematical foundation for understanding uncertainty, distributions, and the reliability of our models.',
 'This module covers essential data handling techniques and statistical concepts that every ML engineer must master to work effectively with real-world datasets.');

-- Insert checkpoints for Module 0
INSERT INTO checkpoints (module_id, checkpoint_number, title, content) VALUES
(1, 0.1, 'What is Machine Learning?', 
 'Machine Learning (ML) is a subset of artificial intelligence that enables computers to learn and make decisions from data without being explicitly programmed for every scenario. Instead of writing specific rules for every possible situation, we provide algorithms with examples (data) and let them discover patterns.

Think of it like teaching a child to recognize animals. Instead of describing every possible feature of every animal, you show them many pictures of cats and dogs with labels. Eventually, they learn to distinguish between cats and dogs on their own.

ML systems improve their performance on a specific task through experience. The "experience" comes from data, and the "improvement" is measured by how well the system performs on new, unseen examples.

Key characteristics of ML:
- **Data-driven**: Decisions are based on patterns found in data
- **Automatic**: The system learns patterns without explicit programming
- **Generalizable**: Good ML systems work well on new, unseen data
- **Iterative**: Performance improves with more data and better algorithms'),

(1, 0.2, 'Types of Machine Learning',
 'Machine learning problems fall into several categories based on the type of learning signal or feedback available during training:

**Supervised Learning**: Learning with labeled examples
- You have input data (features) and correct answers (labels)
- Goal: Learn to predict labels for new, unseen inputs
- Examples: Email spam detection, medical diagnosis, price prediction
- Common algorithms: Linear regression, decision trees, neural networks

**Unsupervised Learning**: Finding patterns in data without labels
- You have input data but no correct answers
- Goal: Discover hidden structures or patterns in the data
- Examples: Customer segmentation, anomaly detection, data compression
- Common algorithms: K-means clustering, PCA, autoencoders

**Reinforcement Learning**: Learning through interaction and feedback
- An agent learns by taking actions in an environment
- Receives rewards or penalties based on actions
- Goal: Learn optimal behavior to maximize cumulative reward
- Examples: Game playing (chess, Go), robotics, autonomous vehicles

**Semi-supervised Learning**: Combines labeled and unlabeled data
- Uses a small amount of labeled data with a large amount of unlabeled data
- Useful when labeling is expensive or time-consuming
- Examples: Web page classification, protein sequence analysis'),

(1, 0.3, 'The Machine Learning Workflow',
 'Successful ML projects follow a systematic workflow. Understanding this process is crucial for ML engineers:

**1. Problem Definition**
- Clearly define what you want to predict or discover
- Determine if it''s a supervised, unsupervised, or reinforcement learning problem
- Establish success metrics and constraints

**2. Data Collection and Exploration**
- Gather relevant data from various sources
- Explore data characteristics: size, quality, distributions
- Identify potential issues: missing values, outliers, biases

**3. Data Preprocessing**
- Clean the data: handle missing values, remove duplicates
- Transform features: scaling, encoding categorical variables
- Split data into training, validation, and test sets

**4. Model Selection and Training**
- Choose appropriate algorithms based on the problem type
- Train multiple models and compare their performance
- Tune hyperparameters to optimize performance

**5. Model Evaluation**
- Assess model performance using appropriate metrics
- Test on unseen data to estimate real-world performance
- Check for overfitting, underfitting, and bias

**6. Deployment and Monitoring**
- Deploy the model to production environment
- Monitor performance and data drift over time
- Retrain or update models as needed

This workflow is iterative—you often need to go back to earlier steps based on what you learn in later stages.');

-- Insert checkpoints for Module 1
INSERT INTO checkpoints (module_id, checkpoint_number, title, content) VALUES
(2, 1.1, 'Understanding Your Data',
 'Before applying any machine learning algorithm, you must thoroughly understand your data. This process, called Exploratory Data Analysis (EDA), helps you uncover patterns, spot anomalies, and make informed decisions about preprocessing and modeling.

**Key aspects to explore:**

**Data Types and Structure**
- Numerical data: continuous (height, temperature) vs discrete (count of items)
- Categorical data: nominal (colors, names) vs ordinal (ratings, education levels)
- Text data: free-form text, structured text
- Time series data: data points indexed by time

**Data Quality Assessment**
- Missing values: How much data is missing? Is it missing randomly?
- Duplicates: Are there repeated records that need to be removed?
- Outliers: Extreme values that might indicate errors or rare events
- Inconsistencies: Different formats, units, or representations

**Distribution Analysis**
- Central tendency: mean, median, mode
- Spread: variance, standard deviation, range
- Shape: skewness, kurtosis, multimodality
- Relationships: correlations between variables

**Practical EDA techniques:**
- Summary statistics for numerical variables
- Frequency tables for categorical variables
- Histograms and box plots for distributions
- Scatter plots for relationships between variables
- Correlation matrices for feature relationships'),

(2, 1.2, 'Descriptive Statistics',
 'Descriptive statistics summarize and describe the main features of your dataset. They provide the foundation for understanding your data and making informed modeling decisions.

**Measures of Central Tendency**

**Mean (Average)**
- Sum of all values divided by the number of values
- Sensitive to outliers
- Best for: normally distributed data without extreme outliers
- Example: Average house price in a neighborhood

**Median**
- Middle value when data is sorted
- Robust to outliers
- Best for: skewed distributions or data with outliers
- Example: Median income (less affected by billionaires than mean)

**Mode**
- Most frequently occurring value
- Can have multiple modes or no mode
- Best for: categorical data or discrete numerical data
- Example: Most common customer age group

**Measures of Spread**

**Range**
- Difference between maximum and minimum values
- Simple but sensitive to outliers
- Gives basic idea of data spread

**Variance and Standard Deviation**
- Variance: average squared deviation from the mean
- Standard deviation: square root of variance (same units as data)
- Higher values indicate more spread in the data

**Interquartile Range (IQR)**
- Difference between 75th and 25th percentiles
- Robust to outliers
- Used in box plots and outlier detection

Understanding these statistics helps you:
- Choose appropriate preprocessing techniques
- Select suitable machine learning algorithms
- Identify potential data quality issues
- Communicate findings to stakeholders'),

(2, 1.3, 'Data Distributions and Probability',
 'Understanding probability distributions is crucial for machine learning because many algorithms make assumptions about how data is distributed. Recognizing common distributions helps you choose appropriate models and preprocessing techniques.

**Normal Distribution (Gaussian)**
- Bell-shaped, symmetric curve
- Defined by mean (μ) and standard deviation (σ)
- Many natural phenomena follow this distribution
- Important because: Central Limit Theorem, many ML algorithms assume normality
- Examples: Heights, measurement errors, test scores

**Skewed Distributions**
- **Right-skewed (positive skew)**: tail extends to the right
- **Left-skewed (negative skew)**: tail extends to the left
- Common in: income data, response times, counts
- May need transformation (log, square root) for some algorithms

**Uniform Distribution**
- All values equally likely within a range
- Flat, rectangular shape
- Examples: random number generation, some sampling scenarios

**Exponential Distribution**
- Models time between events
- Decreasing curve starting high
- Examples: time between customer arrivals, system failures

**Key Probability Concepts**

**Probability Density vs. Probability Mass**
- Density: for continuous variables (height, weight)
- Mass: for discrete variables (number of children, dice rolls)

**Percentiles and Quantiles**
- 25th percentile (Q1): 25% of data falls below this value
- 50th percentile (Q2): median
- 75th percentile (Q3): 75% of data falls below this value
- Used for: outlier detection, data summarization, feature engineering

**Why This Matters for ML:**
- Feature scaling decisions
- Algorithm selection (some assume normality)
- Outlier detection strategies
- Understanding model predictions and confidence intervals');

-- Insert questions for Module 0 checkpoints
INSERT INTO questions (checkpoint_id, question_text, scenario) VALUES
(1, 'Which statement best describes machine learning?', 
 'You''re explaining machine learning to a business stakeholder who wants to understand how it differs from traditional programming approaches.'),

(1, 'What is the key advantage of machine learning over traditional rule-based programming?', 
 'A company is deciding whether to use traditional programming or machine learning for a new product recommendation system.'),

(2, 'Which type of machine learning would be most appropriate for email spam detection?', 
 'You''re building an email filtering system and have access to thousands of emails that have been manually labeled as "spam" or "not spam" by users.'),

(2, 'What characterizes unsupervised learning?', 
 'A retail company wants to understand their customer base better but doesn''t have any specific labels or categories for their customers.'),

(2, 'Which scenario best describes reinforcement learning?', 
 'You need to choose the right machine learning approach for different business problems your team is working on.'),

(3, 'What is the primary purpose of splitting data into training, validation, and test sets?', 
 'You''re setting up a machine learning project and need to organize your dataset to ensure reliable model evaluation.'),

(3, 'Why is the problem definition step crucial in the ML workflow?', 
 'Your team is starting a new ML project and stakeholders are eager to jump straight into building models.'),

-- Insert questions for Module 1 checkpoints  
(4, 'Why is Exploratory Data Analysis (EDA) important before building ML models?', 
 'You''ve just received a new dataset for a machine learning project and your manager is asking why you need to spend time exploring the data instead of immediately training models.'),

(4, 'Which type of data quality issue could most significantly impact model performance?', 
 'You''re reviewing a dataset and need to prioritize which data quality issues to address first given limited time and resources.'),

(5, 'When would you prefer using the median over the mean?', 
 'You''re analyzing house prices in a neighborhood that includes both typical family homes and a few luxury mansions worth millions of dollars.'),

(5, 'What does a high standard deviation indicate about your data?', 
 'You''re comparing two datasets: Dataset A has a standard deviation of 2.1, while Dataset B has a standard deviation of 15.7. Both have similar means.'),

(6, 'Why might a right-skewed distribution be problematic for some machine learning algorithms?', 
 'You''re working with income data that shows a typical right-skewed pattern, where most people earn moderate amounts but a few earn extremely high incomes.'),

(6, 'What is the primary purpose of understanding your data''s probability distribution?', 
 'You''re preparing features for a machine learning model and need to decide on preprocessing steps.');

-- Insert answers for Module 0 questions
-- Question 1 answers
INSERT INTO answers (question_id, answer_text, is_correct, explanation) VALUES
(1, 'A method for computers to learn patterns from data without explicit programming for every scenario', true, 
 'Correct! This captures the essence of machine learning - systems that improve performance through experience (data) rather than being explicitly programmed for every possible situation.'),

(1, 'A way to program computers using if-then rules for all possible situations', false,
 'Incorrect. This describes traditional rule-based programming, not machine learning. ML specifically avoids having to write explicit rules for every scenario.'),

(1, 'A technique that only works with numerical data and mathematical equations', false,
 'Incorrect. Machine learning works with many types of data including text, images, categorical data, and more. While math is involved, it''s not limited to numerical data.'),

(1, 'A replacement for all traditional programming that will eventually make programmers obsolete', false,
 'Incorrect. ML is a tool that complements traditional programming for specific types of problems, particularly those involving pattern recognition and prediction from data.');

-- Question 2 answers  
INSERT INTO answers (question_id, answer_text, is_correct, explanation) VALUES
(2, 'ML can automatically adapt to new patterns in data without requiring manual rule updates', true,
 'Correct! This is the key advantage - ML systems can learn and adapt to new patterns automatically, while traditional rule-based systems require manual updates for every new scenario.'),

(2, 'ML is always faster to execute than traditional programming', false,
 'Incorrect. ML models can actually be slower to execute than simple rule-based systems, especially complex models. The advantage is adaptability, not speed.'),

(2, 'ML requires less data than traditional programming approaches', false,
 'Incorrect. ML typically requires substantial amounts of data to learn patterns effectively, while traditional programming can work with minimal or no historical data.'),

(2, 'ML is easier to debug and understand than traditional code', false,
 'Incorrect. ML models, especially complex ones, can be quite difficult to interpret and debug compared to explicit rule-based code.');

-- Question 3 answers
INSERT INTO answers (question_id, answer_text, is_correct, explanation) VALUES
(3, 'Supervised learning', true,
 'Correct! Email spam detection is a classic supervised learning problem because you have labeled examples (emails marked as spam or not spam) to train the model.'),

(3, 'Unsupervised learning', false,
 'Incorrect. Unsupervised learning is used when you don''t have labels. Since you have emails labeled as spam/not spam, this is supervised learning.'),

(3, 'Reinforcement learning', false,
 'Incorrect. Reinforcement learning involves an agent learning through trial and error with rewards/penalties. Email classification doesn''t fit this paradigm.'),

(3, 'Semi-supervised learning', false,
 'Incorrect. While semi-supervised learning could be used if you had mostly unlabeled emails with just a few labeled ones, the scenario describes having thousands of labeled examples.');

-- Question 4 answers
INSERT INTO answers (question_id, answer_text, is_correct, explanation) VALUES
(4, 'Learning without labeled examples to discover hidden patterns in data', true,
 'Correct! Unsupervised learning finds patterns, structures, or groupings in data without having predefined labels or correct answers.'),

(4, 'Learning with both correct and incorrect examples provided', false,
 'Incorrect. This describes supervised learning, where you have labeled examples with known correct answers.'),

(4, 'Learning through trial and error with rewards and penalties', false,
 'Incorrect. This describes reinforcement learning, where an agent learns through interaction with an environment.'),

(4, 'Learning that requires human supervision at every step', false,
 'Incorrect. Despite the name, unsupervised learning actually requires less human intervention during the learning process.');

-- Question 5 answers
INSERT INTO answers (question_id, answer_text, is_correct, explanation) VALUES
(5, 'Training a game-playing AI that learns by playing many games and receiving win/loss feedback', true,
 'Correct! This is reinforcement learning - an agent (game AI) learns through interaction (playing games) and receives feedback (win/loss) to improve its strategy.'),

(5, 'Classifying images using a dataset of pre-labeled photos', false,
 'Incorrect. This is supervised learning because you have pre-labeled examples to learn from.'),

(5, 'Finding customer segments in sales data without predefined categories', false,
 'Incorrect. This is unsupervised learning because you''re discovering patterns without predefined labels.'),

(5, 'Predicting house prices using historical sales data', false,
 'Incorrect. This is supervised learning because you have historical examples with known prices (labels).');

-- Question 6 answers
INSERT INTO answers (question_id, answer_text, is_correct, explanation) VALUES
(6, 'To ensure reliable evaluation of model performance on unseen data', true,
 'Correct! Data splitting prevents overfitting and gives you an honest estimate of how your model will perform on new, real-world data.'),

(6, 'To make the dataset larger and provide more training examples', false,
 'Incorrect. Splitting actually reduces the amount of data available for training. The purpose is evaluation, not increasing data size.'),

(6, 'To speed up the training process by using smaller datasets', false,
 'Incorrect. While smaller training sets train faster, that''s not the primary purpose of data splitting. Proper evaluation is the goal.'),

(6, 'To ensure all data types are represented in each subset', false,
 'Incorrect. While stratified sampling can help maintain representation, the primary purpose is to create independent sets for training and evaluation.');

-- Question 7 answers
INSERT INTO answers (question_id, answer_text, is_correct, explanation) VALUES
(7, 'It ensures everyone understands the goal and success criteria before investing time and resources', true,
 'Correct! Clear problem definition prevents wasted effort, ensures alignment among stakeholders, and establishes measurable success criteria.'),

(7, 'It''s just a formality that can be skipped if the team is experienced', false,
 'Incorrect. Even experienced teams benefit from clear problem definition. Assumptions and miscommunications can derail projects regardless of experience level.'),

(7, 'It only matters for complex problems; simple problems don''t need formal definition', false,
 'Incorrect. Even seemingly simple problems can have hidden complexity or multiple valid interpretations. Clear definition is always valuable.'),

(7, 'It''s primarily important for documentation and reporting purposes', false,
 'Incorrect. While documentation is important, problem definition directly impacts technical decisions like algorithm choice, data requirements, and evaluation metrics.');

-- Insert answers for Module 1 questions
-- Question 8 answers
INSERT INTO answers (question_id, answer_text, is_correct, explanation) VALUES
(8, 'It helps identify data quality issues, understand patterns, and make informed preprocessing decisions', true,
 'Correct! EDA is essential for understanding your data''s characteristics, spotting problems early, and making informed decisions about how to prepare data for modeling.'),

(8, 'It''s mainly for creating visualizations to impress stakeholders', false,
 'Incorrect. While visualizations can be useful for communication, EDA''s primary purpose is to understand the data for better modeling decisions.'),

(8, 'It''s only necessary when working with unfamiliar datasets', false,
 'Incorrect. Even familiar datasets can have unexpected characteristics, and EDA should be performed on every dataset to ensure data quality and understand current patterns.'),

(8, 'It can be skipped if you have a large enough dataset', false,
 'Incorrect. Large datasets can actually have more complex quality issues and patterns that require thorough exploration. Size doesn''t eliminate the need for EDA.');

-- Question 9 answers
INSERT INTO answers (question_id, answer_text, is_correct, explanation) VALUES
(9, 'Systematic missing data that creates bias in your model', true,
 'Correct! Non-random missing data can introduce serious bias. For example, if high-income individuals systematically don''t report income, your model will be biased toward lower-income patterns.'),

(9, 'A few random outliers scattered throughout the dataset', false,
 'Incorrect. While outliers need attention, a few random outliers typically have less impact than systematic bias from missing data patterns.'),

(9, 'Minor inconsistencies in data formatting', false,
 'Incorrect. Formatting issues are important but usually easier to fix and less likely to fundamentally bias your model than systematic missing data.'),

(9, 'Having slightly different data types for similar variables', false,
 'Incorrect. Data type inconsistencies are technical issues that can usually be resolved during preprocessing without major impact on model validity.');

-- Question 10 answers
INSERT INTO answers (question_id, answer_text, is_correct, explanation) VALUES
(10, 'When your data has outliers or is skewed, as median is less affected by extreme values', true,
 'Correct! In your house price example, the few luxury mansions would pull the mean much higher than typical home values, while the median better represents the typical home price.'),

(10, 'When you have a small dataset, as median works better with limited data', false,
 'Incorrect. Sample size doesn''t determine whether to use mean or median. The choice depends on data distribution and the presence of outliers.'),

(10, 'When your data is normally distributed, as median is more accurate for normal distributions', false,
 'Incorrect. For normally distributed data without outliers, mean and median are very similar. Mean is actually the standard measure of central tendency for normal distributions.'),

(10, 'When you need to do mathematical calculations, as median is easier to compute', false,
 'Incorrect. Mean is actually easier to compute and more mathematically tractable. Median is chosen for robustness, not computational simplicity.');

-- Question 11 answers
INSERT INTO answers (question_id, answer_text, is_correct, explanation) VALUES
(11, 'The data points are spread out widely from the average value', true,
 'Correct! Standard deviation measures spread - Dataset B with σ=15.7 has much more variability than Dataset A with σ=2.1, meaning its values are more scattered around the mean.'),

(11, 'The data has more outliers than data with low standard deviation', false,
 'Incorrect. While outliers can increase standard deviation, high standard deviation doesn''t necessarily mean outliers - it could just indicate natural variability in the data.'),

(11, 'The mean is unreliable and should not be used', false,
 'Incorrect. High standard deviation doesn''t make the mean unreliable - it just indicates that individual data points vary widely from that mean.'),

(11, 'The dataset contains errors and should be cleaned', false,
 'Incorrect. High variability doesn''t necessarily indicate errors. Some phenomena naturally have high variability (e.g., individual response times, stock prices).');

-- Question 12 answers
INSERT INTO answers (question_id, answer_text, is_correct, explanation) VALUES
(12, 'Many algorithms assume normally distributed data, and skewed data can lead to biased models', true,
 'Correct! Algorithms like linear regression assume normality. Right-skewed income data can cause models to be overly influenced by high earners, leading to poor predictions for typical incomes.'),

(12, 'Skewed data always contains errors that need to be removed', false,
 'Incorrect. Skewness is often natural (like income distribution) and doesn''t indicate errors. The issue is algorithmic assumptions, not data quality.'),

(12, 'Right-skewed data cannot be used for machine learning at all', false,
 'Incorrect. Skewed data can be used - it might need transformation (like log transformation) or you might choose algorithms that don''t assume normality.'),

(12, 'Skewed distributions make it impossible to calculate meaningful statistics', false,
 'Incorrect. You can calculate statistics for skewed data, though you might prefer robust statistics like median over mean for central tendency.');

-- Question 13 answers
INSERT INTO answers (question_id, answer_text, is_correct, explanation) VALUES
(13, 'To choose appropriate preprocessing techniques and algorithms that match your data characteristics', true,
 'Correct! Understanding distribution helps you decide on transformations (log for skewed data), choose suitable algorithms (some assume normality), and set appropriate parameters.'),

(13, 'To make your data visualizations look more professional', false,
 'Incorrect. While understanding distributions helps create better visualizations, the primary purpose is making informed technical decisions about modeling.'),

(13, 'To impress stakeholders with statistical knowledge', false,
 'Incorrect. Understanding distributions is a practical necessity for effective modeling, not for demonstration purposes.'),

(13, 'To determine how much data you need to collect', false,
 'Incorrect. While distribution characteristics can inform sample size calculations, the primary purpose is understanding existing data for preprocessing and algorithm selection.');

SELECT 'Seed data insertion completed successfully!' as status;