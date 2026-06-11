-- MyUniPath Database Setup
-- Import this file in phpMyAdmin (select myunipath database, then Import)

USE myunipath;

-- Users (Laravel default)
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text,
  `payload` longtext NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Cache (Laravel default)
CREATE TABLE IF NOT EXISTS `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Jobs (Laravel default)
CREATE TABLE IF NOT EXISTS `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Programs
CREATE TABLE IF NOT EXISTS `programs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `slug` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `short_desc` varchar(255) NOT NULL,
  `color` varchar(255) DEFAULT 'blue',
  `description` text,
  `duration` varchar(255) DEFAULT NULL,
  `fees` varchar(255) DEFAULT NULL,
  `requirements` json DEFAULT NULL,
  `careers` json DEFAULT NULL,
  `highlights` json DEFAULT NULL,
  `why_this_program` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `programs_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Quiz Questions
CREATE TABLE IF NOT EXISTS `quiz_questions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order` int unsigned DEFAULT 0,
  `question` varchar(255) NOT NULL,
  `options` json NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Quiz Completions
CREATE TABLE IF NOT EXISTS `quiz_completions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned DEFAULT NULL,
  `persona` varchar(255) NOT NULL,
  `logic_score` int DEFAULT 0,
  `creative_score` int DEFAULT 0,
  `answers` json DEFAULT NULL,
  `recommended_program_ids` json DEFAULT NULL,
  `session_id` varchar(255) DEFAULT NULL,
  `ip_address` varchar(255) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Students
CREATE TABLE IF NOT EXISTS `students` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `age` varchar(255) DEFAULT NULL,
  `spm_result_path` varchar(255) DEFAULT NULL,
  `persona` varchar(255) DEFAULT NULL,
  `quiz_completed` tinyint(1) DEFAULT 0,
  `session_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Admin Settings
CREATE TABLE IF NOT EXISTS `admin_settings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `key` varchar(255) NOT NULL,
  `value` text,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `admin_settings_key_unique` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed Programs
INSERT INTO `programs` (`slug`, `name`, `icon`, `short_desc`, `color`, `description`, `duration`, `fees`, `requirements`, `careers`, `highlights`, `created_at`, `updated_at`) VALUES
('software-engineering', 'Software Engineering', '💻', 'Design and build robust software systems', 'blue', 'Learn to design, develop, and maintain complex software systems. This program combines computer science fundamentals with practical software development skills.', '4 years', '~RM 80,000', '["SPM with at least 5 credits including Mathematics and one Science subject","Pass in English","Strong interest in programming and problem-solving"]', '["Software Developer","Full-Stack Engineer","Mobile App Developer","DevOps Engineer"]', '["Industry-relevant curriculum","Hands-on project experience","Internship opportunities"]', NOW(), NOW()),
('information-technology', 'Information Technology', '🖥️', 'Manage and optimize technology infrastructure', 'indigo', 'Focus on managing, implementing, and supporting technology infrastructure. Covers networks, databases, systems administration, and IT management.', '4 years', '~RM 75,000', '["SPM with at least 5 credits including Mathematics","Pass in English"]', '["IT Manager","Systems Administrator","Network Engineer","Database Administrator"]', '["Broad technology coverage","Industry certifications","Real-world IT projects"]', NOW(), NOW()),
('information-systems', 'Information Systems', '📋', 'Bridge business needs with technology solutions', 'indigo', 'Combines IT with business strategy, preparing you to design and manage systems that help organizations succeed.', '4 years', '~RM 72,000', '["SPM with at least 5 credits including Mathematics","Pass in English"]', '["Business Analyst","IT Consultant","Systems Analyst","Project Manager"]', '["Business-IT integration","Real-world projects","Industry partnerships"]', NOW(), NOW()),
('cybersecurity', 'Cybersecurity', '🔒', 'Protect systems and data from threats', 'red', 'Become a digital defender. Learn to protect systems, networks, and data from cyber threats.', '4 years', '~RM 85,000', '["SPM with at least 5 credits including Mathematics and one Science subject","Pass in English","Strong ethical standards"]', '["Security Analyst","Ethical Hacker","Security Consultant","Incident Response Specialist"]', '["Ethical hacking labs","Industry-standard tools","Security certifications"]', NOW(), NOW()),
('data-science', 'Data Science', '📈', 'Extract insights and value from data', 'purple', 'Turn data into insights. Learn statistics, machine learning, data visualization, and big data technologies.', '4 years', '~RM 82,000', '["SPM with at least 5 credits including Mathematics and one Science subject","Pass in English"]', '["Data Scientist","Machine Learning Engineer","Business Intelligence Analyst","Data Engineer"]', '["Hands-on with real datasets","Machine learning focus","Industry partnerships"]', NOW(), NOW()),
('artificial-intelligence', 'Artificial Intelligence', '🤖', 'Build intelligent systems and AI solutions', 'purple', 'Learn machine learning, natural language processing, computer vision, and AI ethics.', '4 years', '~RM 88,000', '["SPM with at least 5 credits including Mathematics and one Science subject","Pass in English"]', '["AI Engineer","Machine Learning Engineer","AI Research Scientist","NLP Specialist"]', '["Machine learning labs","AI ethics focus","Research opportunities"]', NOW(), NOW());

-- Seed Quiz Questions
INSERT INTO `quiz_questions` (`order`, `question`, `options`, `created_at`, `updated_at`) VALUES
(1, 'What excites you most about technology?', '[{"text":"Building apps and websites","persona":"creator","icon":"💻","logic":1,"creative":4},{"text":"Solving complex problems","persona":"solver","icon":"🧩","logic":4,"creative":1},{"text":"Protecting systems from threats","persona":"guardian","icon":"🛡️","logic":4,"creative":0},{"text":"Finding patterns in data","persona":"analyst","icon":"📊","logic":4,"creative":2}]', NOW(), NOW()),
(2, 'How do you prefer to work?', '[{"text":"In a creative team environment","persona":"creator","icon":"👥","logic":1,"creative":4},{"text":"Independently on challenging tasks","persona":"solver","icon":"🎯","logic":4,"creative":2},{"text":"Methodically with attention to detail","persona":"guardian","icon":"🔍","logic":4,"creative":1},{"text":"Analyzing and interpreting information","persona":"analyst","icon":"📈","logic":4,"creative":2}]', NOW(), NOW()),
(3, 'Which activity sounds most interesting?', '[{"text":"Designing user-friendly interfaces","persona":"creator","icon":"🎨","logic":2,"creative":4},{"text":"Debugging and optimizing code","persona":"solver","icon":"⚙️","logic":4,"creative":1},{"text":"Setting up security protocols","persona":"guardian","icon":"🔐","logic":4,"creative":0},{"text":"Creating data visualizations","persona":"analyst","icon":"📉","logic":3,"creative":3}]', NOW(), NOW()),
(4, "What's your ideal work outcome?", '[{"text":"A product people love to use","persona":"creator","icon":"❤️","logic":1,"creative":4},{"text":"An efficient, elegant solution","persona":"solver","icon":"✨","logic":4,"creative":2},{"text":"A secure, protected system","persona":"guardian","icon":"🔒","logic":4,"creative":0},{"text":"Actionable insights from data","persona":"analyst","icon":"💡","logic":4,"creative":2}]', NOW(), NOW()),
(5, 'Which skill do you want to develop most?', '[{"text":"Front-end development & design","persona":"creator","icon":"🎭","logic":1,"creative":4},{"text":"Algorithm design & optimization","persona":"solver","icon":"🧮","logic":4,"creative":1},{"text":"Ethical hacking & defense","persona":"guardian","icon":"🕵️","logic":4,"creative":1},{"text":"Machine learning & statistics","persona":"analyst","icon":"🤖","logic":4,"creative":2}]', NOW(), NOW()),
(6, 'What motivates you in a career?', '[{"text":"Creating something new","persona":"creator","icon":"🚀","logic":0,"creative":4},{"text":"Overcoming technical challenges","persona":"solver","icon":"🏆","logic":4,"creative":1},{"text":"Keeping people safe online","persona":"guardian","icon":"🛡️","logic":4,"creative":0},{"text":"Discovering hidden insights","persona":"analyst","icon":"🔬","logic":4,"creative":2}]', NOW(), NOW()),
(7, 'Which tech role appeals to you?', '[{"text":"Full-stack developer","persona":"creator","icon":"💼","logic":2,"creative":4},{"text":"Software engineer","persona":"solver","icon":"⚡","logic":4,"creative":2},{"text":"Security analyst","persona":"guardian","icon":"🎖️","logic":4,"creative":0},{"text":"Data scientist","persona":"analyst","icon":"📚","logic":4,"creative":2}]', NOW(), NOW()),
(8, 'How do you approach learning?', '[{"text":"By building projects hands-on","persona":"creator","icon":"🛠️","logic":1,"creative":4},{"text":"By understanding core concepts deeply","persona":"solver","icon":"📖","logic":4,"creative":1},{"text":"By studying real-world scenarios","persona":"guardian","icon":"🌍","logic":4,"creative":1},{"text":"By experimenting with data","persona":"analyst","icon":"🧪","logic":4,"creative":2}]', NOW(), NOW());
