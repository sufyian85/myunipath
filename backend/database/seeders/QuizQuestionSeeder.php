<?php

namespace Database\Seeders;

use App\Models\QuizQuestion;
use Illuminate\Database\Seeder;

class QuizQuestionSeeder extends Seeder
{
    public function run(): void
    {
        $questions = [
            ['order' => 1, 'question' => 'What excites you most about technology?', 'options' => [
                ['text' => 'Building apps and websites', 'persona' => 'creator', 'icon' => '💻', 'logic' => 1, 'creative' => 4],
                ['text' => 'Solving complex problems', 'persona' => 'solver', 'icon' => '🧩', 'logic' => 4, 'creative' => 1],
                ['text' => 'Protecting systems from threats', 'persona' => 'guardian', 'icon' => '🛡️', 'logic' => 4, 'creative' => 0],
                ['text' => 'Finding patterns in data', 'persona' => 'analyst', 'icon' => '📊', 'logic' => 4, 'creative' => 2],
            ]],
            ['order' => 2, 'question' => 'How do you prefer to work?', 'options' => [
                ['text' => 'In a creative team environment', 'persona' => 'creator', 'icon' => '👥', 'logic' => 1, 'creative' => 4],
                ['text' => 'Independently on challenging tasks', 'persona' => 'solver', 'icon' => '🎯', 'logic' => 4, 'creative' => 2],
                ['text' => 'Methodically with attention to detail', 'persona' => 'guardian', 'icon' => '🔍', 'logic' => 4, 'creative' => 1],
                ['text' => 'Analyzing and interpreting information', 'persona' => 'analyst', 'icon' => '📈', 'logic' => 4, 'creative' => 2],
            ]],
            ['order' => 3, 'question' => 'Which activity sounds most interesting?', 'options' => [
                ['text' => 'Designing user-friendly interfaces', 'persona' => 'creator', 'icon' => '🎨', 'logic' => 2, 'creative' => 4],
                ['text' => 'Debugging and optimizing code', 'persona' => 'solver', 'icon' => '⚙️', 'logic' => 4, 'creative' => 1],
                ['text' => 'Setting up security protocols', 'persona' => 'guardian', 'icon' => '🔐', 'logic' => 4, 'creative' => 0],
                ['text' => 'Creating data visualizations', 'persona' => 'analyst', 'icon' => '📉', 'logic' => 3, 'creative' => 3],
            ]],
            ['order' => 4, 'question' => "What's your ideal work outcome?", 'options' => [
                ['text' => 'A product people love to use', 'persona' => 'creator', 'icon' => '❤️', 'logic' => 1, 'creative' => 4],
                ['text' => 'An efficient, elegant solution', 'persona' => 'solver', 'icon' => '✨', 'logic' => 4, 'creative' => 2],
                ['text' => 'A secure, protected system', 'persona' => 'guardian', 'icon' => '🔒', 'logic' => 4, 'creative' => 0],
                ['text' => 'Actionable insights from data', 'persona' => 'analyst', 'icon' => '💡', 'logic' => 4, 'creative' => 2],
            ]],
            ['order' => 5, 'question' => 'Which skill do you want to develop most?', 'options' => [
                ['text' => 'Front-end development & design', 'persona' => 'creator', 'icon' => '🎭', 'logic' => 1, 'creative' => 4],
                ['text' => 'Algorithm design & optimization', 'persona' => 'solver', 'icon' => '🧮', 'logic' => 4, 'creative' => 1],
                ['text' => 'Ethical hacking & defense', 'persona' => 'guardian', 'icon' => '🕵️', 'logic' => 4, 'creative' => 1],
                ['text' => 'Machine learning & statistics', 'persona' => 'analyst', 'icon' => '🤖', 'logic' => 4, 'creative' => 2],
            ]],
            ['order' => 6, 'question' => 'What motivates you in a career?', 'options' => [
                ['text' => 'Creating something new', 'persona' => 'creator', 'icon' => '🚀', 'logic' => 0, 'creative' => 4],
                ['text' => 'Overcoming technical challenges', 'persona' => 'solver', 'icon' => '🏆', 'logic' => 4, 'creative' => 1],
                ['text' => 'Keeping people safe online', 'persona' => 'guardian', 'icon' => '🛡️', 'logic' => 4, 'creative' => 0],
                ['text' => 'Discovering hidden insights', 'persona' => 'analyst', 'icon' => '🔬', 'logic' => 4, 'creative' => 2],
            ]],
            ['order' => 7, 'question' => 'Which tech role appeals to you?', 'options' => [
                ['text' => 'Full-stack developer', 'persona' => 'creator', 'icon' => '💼', 'logic' => 2, 'creative' => 4],
                ['text' => 'Software engineer', 'persona' => 'solver', 'icon' => '⚡', 'logic' => 4, 'creative' => 2],
                ['text' => 'Security analyst', 'persona' => 'guardian', 'icon' => '🎖️', 'logic' => 4, 'creative' => 0],
                ['text' => 'Data scientist', 'persona' => 'analyst', 'icon' => '📚', 'logic' => 4, 'creative' => 2],
            ]],
            ['order' => 8, 'question' => 'How do you approach learning?', 'options' => [
                ['text' => 'By building projects hands-on', 'persona' => 'creator', 'icon' => '🛠️', 'logic' => 1, 'creative' => 4],
                ['text' => 'By understanding core concepts deeply', 'persona' => 'solver', 'icon' => '📖', 'logic' => 4, 'creative' => 1],
                ['text' => 'By studying real-world scenarios', 'persona' => 'guardian', 'icon' => '🌍', 'logic' => 4, 'creative' => 1],
                ['text' => 'By experimenting with data', 'persona' => 'analyst', 'icon' => '🧪', 'logic' => 4, 'creative' => 2],
            ]],
        ];

        QuizQuestion::query()->delete();
        foreach ($questions as $q) {
            QuizQuestion::create($q);
        }
    }
}
