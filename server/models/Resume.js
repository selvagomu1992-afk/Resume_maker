import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    title: {type: String, default: 'Untitled Resume'},
    public: { type: Boolean, default: false },
    isPaid: { type: Boolean, default: false },
    paidOrderId: { type: String, default: '' },
    template: { type: String, default: "classic" },
    accent_color: { type: String, default: "#3B82F6" },
    professional_summary: { type: String, default: '' },
    skills: [
        {
            name: { type: String },
            level: { type: Number, default: 3 },
        }
    ],
    personal_info: {
        image: {type: String, default: '' },
        full_name: {type: String, default: '' },
        profession: {type: String, default: '' },
        email: {type: String, default: '' },
        phone: {type: String, default: '' },
        location: {type: String, default: '' },
        linkedin: {type: String, default: '' },
        website: {type: String, default: '' },
    },
    experience: [
        {
            company: { type: String },
            position: { type: String },
            start_date: { type: String },
            end_date: { type: String },
            description: { type: String },
            is_current: { type: Boolean },
        }
    ],
    project: [
        {
            name: { type: String },
            type: { type: String },
            description: { type: String },
        }
    ],
    education: [
        {
            institution: { type: String },
            degree: { type: String },
            field: { type: String },
            graduation_date: { type: String },
            gpa: { type: String },
        }
    ],
    languages: [
        {
            name: { type: String },
            read: { type: Boolean, default: false },
            write: { type: Boolean, default: false },
            speak: { type: Boolean, default: false },
        }
    ],
    achievements: [
        {
            category: { type: String },
            title: { type: String },
            from_value: { type: Number },
            to_value: { type: Number },
            unit: { type: String },
            description: { type: String },
        }
    ],
    additional_info: [
        {
            category: { type: String },  // e.g. "Certification", "Award", "Hobby", "Volunteer", "Reference"
            title: { type: String },
            subtitle: { type: String },  // e.g. issuer, organization
            date: { type: String },
            description: { type: String },
        }
    ],
}, {timestamps: true, minimize: false})

const Resume = mongoose.model('Resume', ResumeSchema)

export default Resume