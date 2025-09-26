const User = require('../models/user.model.js');
const mongoose = require('mongoose');

const getDepartmentStats = async (req, res) => {
    try {
        const { deptName } = req.params;
        console.log(`Fetching stats for department: [${deptName}]`);
        const pipeline = [
            // Stage 1: Match only the documents we need (students in a specific department)
            {
                $match: {
                    role: 'student',
                    dept: new RegExp('^' + deptName + '$', 'i')
                }
            },
            // Stage 2: Group the documents and calculate stats
            {
                $group: {
                    _id: '$dept', // Group by department
                    totalStudents: { $sum: 1 }, // Count every student in the group
                    
                    // Conditionally sum only the placed students
                    placedStudents: {
                        $sum: { $cond: [{ $eq: ['$isPlaced', true] }, 1, 0] }
                    },
                    
                    // Calculate package stats ONLY for placed students
                    minPackage: { $min: { $cond: [{ $eq: ['$isPlaced', true] }, '$package', null] } },
                    maxPackage: { $max: { $cond: [{ $eq: ['$isPlaced', true] }, '$package', null] } },
                    avgPackage: { $avg: { $cond: [{ $eq: ['$isPlaced', true] }, '$package', null] } }
                }
            },
            // Stage 3: Reshape the output and calculate the placement percentage
            {
                $project: {
                    _id: 0, // Exclude the default _id field
                    department: '$_id',
                    totalStudents: 1, // Keep the field
                    placedStudents: 1, // Keep the field
                    minPackage: { $ifNull: ['$minPackage', 0] }, // Show 0 if no one is placed
                    maxPackage: { $ifNull: ['$maxPackage', 0] }, // Show 0 if no one is placed
                    avgPackage: { $ifNull: ['$avgPackage', 0] }, // Show 0 if no one is placed
                    
                    // Calculate percentage, handling division by zero
                    placedPercentage: {
                        $cond: [
                            { $eq: ['$totalStudents', 0] },
                            0,
                            { $multiply: [{ $divide: ['$placedStudents', '$totalStudents'] }, 100] }
                        ]
                    }
                }
            }
        ];

        const stats = await User.aggregate(pipeline);

        if (stats.length === 0) {
            // This happens if the department has no students
            return res.status(200).json({
                department: deptName,
                totalStudents: 0,
                placedStudents: 0,
                minPackage: 0,
                maxPackage: 0,
                avgPackage: 0,
                placedPercentage: 0
            });
        }
        
        // Round the average and percentage for a cleaner look
        const result = stats[0];
        result.avgPackage = Math.round(result.avgPackage * 100) / 100; // Round to 2 decimal places
        result.placedPercentage = Math.round(result.placedPercentage * 100) / 100;

        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const getAllDepartmentStats = async (req, res) => {
    try {
        const pipeline = [
            // Stage 1: Match only student documents
            { $match: { role: 'student' } },
            // Stage 2: Group by department and calculate stats for each group
            {
                $group: {
                    _id: '$dept', // Group by the 'dept' field
                    totalStudents: { $sum: 1 },
                    placedStudents: {
                        $sum: { $cond: [{ $eq: ['$isPlaced', true] }, 1, 0] }
                    },
                    avgPackage: {
                        $avg: { $cond: [{ $eq: ['$isPlaced', true] }, '$package', null] }
                    }
                }
            },
            // Stage 3: Reshape the output and calculate percentage
            {
                $project: {
                    _id: 0,
                    department: '$_id',
                    totalStudents: 1,
                    placedStudents: 1,
                    avgPackage: { $ifNull: ['$avgPackage', 0] },
                    placedPercentage: {
                        $cond: [
                            { $eq: ['$totalStudents', 0] },
                            0,
                            { $multiply: [{ $divide: ['$placedStudents', '$totalStudents'] }, 100] }
                        ]
                    }
                }
            },
            // Stage 4: Sort the results alphabetically by department name
            { $sort: { department: 1 } }
        ];

        const allStats = await User.aggregate(pipeline);
        
        // Round the numbers for a cleaner response
        allStats.forEach(stat => {
            stat.avgPackage = Math.round(stat.avgPackage * 100) / 100;
            stat.placedPercentage = Math.round(stat.placedPercentage * 100) / 100;
        });

        res.status(200).json(allStats);

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    getDepartmentStats,
    getAllDepartmentStats
};