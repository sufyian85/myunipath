<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PersonaRule;

class PersonaRuleSeeder extends Seeder
{
    public function run(): void
    {
        PersonaRule::truncate();

        $rules = [
            ['answer_text' => 'Building apps and websites', 'persona' => 'creator', 'points' => 10],
            ['answer_text' => 'Building apps and websites', 'persona' => 'solver', 'points' => 2],
            ['answer_text' => 'Solving complex problems', 'persona' => 'solver', 'points' => 10],
            ['answer_text' => 'Protecting systems from threats', 'persona' => 'guardian', 'points' => 10],
            ['answer_text' => 'Finding patterns in data', 'persona' => 'analyst', 'points' => 10],
            ['answer_text' => 'In a creative team environment', 'persona' => 'creator', 'points' => 8],
            ['answer_text' => 'Independently on challenging tasks', 'persona' => 'solver', 'points' => 8],
            ['answer_text' => 'Methodically with attention to detail', 'persona' => 'guardian', 'points' => 8],
            ['answer_text' => 'Analyzing and interpreting information', 'persona' => 'analyst', 'points' => 8],
            ['answer_text' => 'Designing user-friendly interfaces', 'persona' => 'creator', 'points' => 9],
            ['answer_text' => 'Debugging and optimizing code', 'persona' => 'solver', 'points' => 9],
            ['answer_text' => 'Setting up security protocols', 'persona' => 'guardian', 'points' => 9],
            ['answer_text' => 'Creating data visualizations', 'persona' => 'analyst', 'points' => 9],
            ['answer_text' => 'A product people love to use', 'persona' => 'creator', 'points' => 10],
            ['answer_text' => 'An efficient, elegant solution', 'persona' => 'solver', 'points' => 10],
            ['answer_text' => 'A secure, protected system', 'persona' => 'guardian', 'points' => 10],
            ['answer_text' => 'Actionable insights from data', 'persona' => 'analyst', 'points' => 10],
            ['answer_text' => 'Front-end development & design', 'persona' => 'creator', 'points' => 10],
            ['answer_text' => 'Algorithm design & optimization', 'persona' => 'solver', 'points' => 10],
            ['answer_text' => 'Ethical hacking & defense', 'persona' => 'guardian', 'points' => 10],
            ['answer_text' => 'Machine learning & statistics', 'persona' => 'analyst', 'points' => 10],
            ['answer_text' => 'Creating something new', 'persona' => 'creator', 'points' => 8],
            ['answer_text' => 'Overcoming technical challenges', 'persona' => 'solver', 'points' => 8],
            ['answer_text' => 'Keeping people safe online', 'persona' => 'guardian', 'points' => 8],
            ['answer_text' => 'Discovering hidden insights', 'persona' => 'analyst', 'points' => 8],
            ['answer_text' => 'Full-stack developer', 'persona' => 'creator', 'points' => 10],
            ['answer_text' => 'Software engineer', 'persona' => 'solver', 'points' => 10],
            ['answer_text' => 'Security analyst', 'persona' => 'guardian', 'points' => 10],
            ['answer_text' => 'Data scientist', 'persona' => 'analyst', 'points' => 10],
            ['answer_text' => 'By building projects hands-on', 'persona' => 'creator', 'points' => 7],
            ['answer_text' => 'By understanding core concepts deeply', 'persona' => 'solver', 'points' => 7],
            ['answer_text' => 'By studying real-world scenarios', 'persona' => 'guardian', 'points' => 7],
            ['answer_text' => 'By experimenting with data', 'persona' => 'analyst', 'points' => 7],
        ];

        foreach ($rules as $rule) {
            PersonaRule::create($rule);
        }
    }
}
