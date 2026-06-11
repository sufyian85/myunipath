<?php

namespace Database\Seeders;

use App\Models\Program;
use Illuminate\Database\Seeder;

class ProgramSeeder extends Seeder
{
    public function run(): void
    {
        $programs = [
            [
                'slug' => 'software-engineering',
                'name' => 'Software Engineering',
                'icon' => '💻',
                'short_desc' => 'Design and build robust software systems',
                'color' => 'blue',
                'description' => 'Learn to design, develop, and maintain complex software systems. This program combines computer science fundamentals with practical software development skills.',
                'duration' => '4 years',
                'fees' => '~RM 80,000',
                'requirements' => ['SPM with at least 5 credits including Mathematics and one Science subject', 'Pass in English', 'Strong interest in programming and problem-solving'],
                'careers' => ['Software Developer', 'Full-Stack Engineer', 'Mobile App Developer', 'DevOps Engineer'],
                'highlights' => ['Industry-relevant curriculum', 'Hands-on project experience', 'Internship opportunities'],
            ],
            [
                'slug' => 'information-technology',
                'name' => 'Information Technology',
                'icon' => '🖥️',
                'short_desc' => 'Manage and optimize technology infrastructure',
                'color' => 'indigo',
                'description' => 'Focus on managing, implementing, and supporting technology infrastructure. Covers networks, databases, systems administration, and IT management.',
                'duration' => '4 years',
                'fees' => '~RM 75,000',
                'requirements' => ['SPM with at least 5 credits including Mathematics', 'Pass in English'],
                'careers' => ['IT Manager', 'Systems Administrator', 'Network Engineer', 'Database Administrator'],
                'highlights' => ['Broad technology coverage', 'Industry certifications', 'Real-world IT projects'],
            ],
            [
                'slug' => 'information-systems',
                'name' => 'Information Systems',
                'icon' => '📋',
                'short_desc' => 'Bridge business needs with technology solutions',
                'color' => 'indigo',
                'description' => 'Combines IT with business strategy, preparing you to design and manage systems that help organizations succeed.',
                'duration' => '4 years',
                'fees' => '~RM 72,000',
                'requirements' => ['SPM with at least 5 credits including Mathematics', 'Pass in English'],
                'careers' => ['Business Analyst', 'IT Consultant', 'Systems Analyst', 'Project Manager'],
                'highlights' => ['Business-IT integration', 'Real-world projects', 'Industry partnerships'],
            ],
            [
                'slug' => 'cybersecurity',
                'name' => 'Cybersecurity',
                'icon' => '🔒',
                'short_desc' => 'Protect systems and data from threats',
                'color' => 'red',
                'description' => 'Become a digital defender. Learn to protect systems, networks, and data from cyber threats.',
                'duration' => '4 years',
                'fees' => '~RM 85,000',
                'requirements' => ['SPM with at least 5 credits including Mathematics and one Science subject', 'Pass in English', 'Strong ethical standards'],
                'careers' => ['Security Analyst', 'Ethical Hacker', 'Security Consultant', 'Incident Response Specialist'],
                'highlights' => ['Ethical hacking labs', 'Industry-standard tools', 'Security certifications'],
            ],
            [
                'slug' => 'data-science',
                'name' => 'Data Science',
                'icon' => '📈',
                'short_desc' => 'Extract insights and value from data',
                'color' => 'purple',
                'description' => 'Turn data into insights. Learn statistics, machine learning, data visualization, and big data technologies.',
                'duration' => '4 years',
                'fees' => '~RM 82,000',
                'requirements' => ['SPM with at least 5 credits including Mathematics and one Science subject', 'Pass in English'],
                'careers' => ['Data Scientist', 'Machine Learning Engineer', 'Business Intelligence Analyst', 'Data Engineer'],
                'highlights' => ['Hands-on with real datasets', 'Machine learning focus', 'Industry partnerships'],
            ],
            [
                'slug' => 'artificial-intelligence',
                'name' => 'Artificial Intelligence',
                'icon' => '🤖',
                'short_desc' => 'Build intelligent systems and AI solutions',
                'color' => 'purple',
                'description' => 'Learn machine learning, natural language processing, computer vision, and AI ethics.',
                'duration' => '4 years',
                'fees' => '~RM 88,000',
                'requirements' => ['SPM with at least 5 credits including Mathematics and one Science subject', 'Pass in English'],
                'careers' => ['AI Engineer', 'Machine Learning Engineer', 'AI Research Scientist', 'NLP Specialist'],
                'highlights' => ['Machine learning labs', 'AI ethics focus', 'Research opportunities'],
            ],
        ];

        foreach ($programs as $p) {
            Program::updateOrCreate(['slug' => $p['slug']], $p);
        }
    }
}
