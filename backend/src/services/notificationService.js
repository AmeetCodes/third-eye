const nodemailer = require('nodemailer');
const Subscription = require('../models/Subscription');
const Tender = require('../models/Tender');

// For demo purposes, we will use a generic/fake transporter if env vars are missing
let transporter;
let transporterPromise;

const setupTransporter = async () => {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
        console.log("✅ Real Email Transporter Configured (Gmail)");
    } else {
        // Generate Ethereal test account for demo
        try {
            console.log("🛠️  Initializing Ethereal Test Account... (This may take a few seconds)");
            const testAccount = await nodemailer.createTestAccount();
            transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false, 
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass
                }
            });
            console.log("✅ Ethereal Test Transporter Ready for Hackathon Demo!");
        } catch (err) {
            console.error("❌ Failed to create Ethereal account, falling back to logger.");
            transporter = {
                sendMail: async (options) => {
                    console.log("📨  FALLBACK EMAIL LOG (Transporter Failed):", options.to);
                    return { messageId: 'fallback-logger' };
                }
            };
        }
    }
    return transporter;
};

// Start initialization immediately
transporterPromise = setupTransporter();

/**
 * Ensure the transporter is ready before any send attempt.
 */
const ensureTransporter = async () => {
    if (!transporter) {
        await transporterPromise;
    }
    return transporter;
};

/**
 * Notify all subscribers for a specific tender that the project has been updated.
 */
exports.notifyUpdate = async (tenderId, updateType = 'AWARDED') => {
    try {
        const activeTransporter = await ensureTransporter();
        
        const tender = await Tender.findById(tenderId);
        if (!tender) return false;

        const subscriptions = await Subscription.find({ tenderId });
        if (subscriptions.length === 0) return true;

        const isAwarded = updateType === 'AWARDED';
        const color = isAwarded ? '#059669' : '#0A3992'; // Emerald for success, Blue for info
        const accent = isAwarded ? '#10b981' : '#B93654';

        const htmlBody = `
            <div style="font-family: 'Inter', -apple-system, sans-serif; background-color: #f1f5f9; padding: 40px 10px;">
                <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <div style="background: linear-gradient(135deg, #0A3992 0%, #082f7a 100%); padding: 32px; text-align: center; color: white;">
                        <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">Third Eye <span style="color: #60a5fa;">Watchdog</span></h1>
                        <p style="margin: 8px 0 0; opacity: 0.8; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Transparency Alert System</p>
                    </div>

                    <!-- Content -->
                    <div style="padding: 32px;">
                        <div style="display: flex; align-items: center; margin-bottom: 24px;">
                            <div style="background: ${isAwarded ? '#dcfce7' : '#dbeafe'}; color: ${color}; padding: 8px 16px; border-radius: 99px; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">
                                ${isAwarded ? '🏆 Status: Project Finalized' : '📝 Status: Status Update'}
                            </div>
                        </div>

                        <h2 style="color: #0f172a; font-size: 20px; line-height: 1.4; margin-bottom: 24px; font-weight: 800;">${tender.title}</h2>

                        <!-- Data Card -->
                        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 20px; padding: 24px; margin-bottom: 32px;">
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding-bottom: 16px; width: 50%;">
                                        <p style="margin: 0; font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700; letter-spacing: 0.5px;">District / Region</p>
                                        <p style="margin: 4px 0 0; font-size: 15px; font-weight: 700; color: #1e293b;">📍 ${tender.district || 'National'}</p>
                                    </td>
                                    <td style="padding-bottom: 16px; width: 50%;">
                                        <p style="margin: 0; font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700; letter-spacing: 0.5px;">Civic Trust Score</p>
                                        <p style="margin: 4px 0 0; font-size: 15px; font-weight: 700; color: ${tender.transparencyScore < 60 ? '#ef4444' : '#059669'};">🕵️ ${tender.transparencyScore}%</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding-bottom: 16px;">
                                        <p style="margin: 0; font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700; letter-spacing: 0.5px;">Contractor / JV</p>
                                        <p style="margin: 4px 0 0; font-size: 15px; font-weight: 700; color: #1e293b;">🏗️ ${tender.contractor_name || 'Not Awarded'}</p>
                                    </td>
                                    <td style="padding-bottom: 16px;">
                                        <p style="margin: 0; font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700; letter-spacing: 0.5px;">Project Budget</p>
                                        <p style="margin: 4px 0 0; font-size: 18px; font-weight: 800; color: ${accent};">NPR. ${tender.budget_amount_cr || '0'} Cr</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="2" style="border-top: 1px solid #e2e8f0; padding-top: 16px;">
                                        <p style="margin: 0; font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700; letter-spacing: 0.5px;">Public Entity</p>
                                        <p style="margin: 4px 0 0; font-size: 14px; font-weight: 600; color: #475569;">🏛️ ${tender.public_entity_name || 'Undisclosed Entity'}</p>
                                    </td>
                                </tr>
                            </table>
                        </div>

                        <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin-bottom: 32px;">
                            The monitoring engine detected this change on ${new Date().toLocaleDateString()}. Our platform cross-verifies this spending with the current federal budget to ensure every paisa is accounted for.
                        </p>

                        <div style="text-align: center;">
                            <a href="#" style="display: inline-block; background: #0A3992; color: white; padding: 16px 32px; border-radius: 14px; font-weight: 700; text-decoration: none; font-size: 14px; box-shadow: 0 4px 12px rgba(10,57,146,0.25);">Full Transparency Audit →</a>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 24px; text-align: center;">
                        <p style="margin: 0; color: #94a3b8; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px;">Third Eye Nepal • Citizens Against Corruption</p>
                    </div>
                </div>
            </div>
        `;

        for (const sub of subscriptions) {
            const info = await activeTransporter.sendMail({
                from: `"Third Eye Monitoring" <${process.env.EMAIL_USER}>`,
                to: sub.email,
                subject: `🛡️ Transparency Update: ${tender.title}`,
                html: htmlBody
            });
            console.log(`✅ Update Email sent to: ${sub.email}`);
            sub.status = 'SENT';
            sub.notifiedAt = new Date();
            await sub.save();
        }
        return true;
    } catch (error) {
        console.error("❌ Notification dispatch error:", error.message);
        throw error;
    }
};

/**
 * Sends an immediate "Welcome" or "Watchdog Activated" email when a user first subscribes.
 */
exports.notifyWelcome = async (tenderId, email) => {
    try {
        const activeTransporter = await ensureTransporter();
        const tender = await Tender.findById(tenderId);
        if (!tender) return false;

        const htmlBody = `
            <div style="font-family: 'Inter', -apple-system, sans-serif; background-color: #f1f5f9; padding: 40px 10px;">
                <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <div style="background: linear-gradient(135deg, #B93654 0%, #9e2c46 100%); padding: 32px; text-align: center; color: white;">
                        <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">Watchdog <span style="color: #ffaaae;">Activated</span></h1>
                        <p style="margin: 8px 0 0; opacity: 0.8; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Citizen Accountability Protocol</p>
                    </div>

                    <!-- Content -->
                    <div style="padding: 32px;">
                        <div style="text-align: center; margin-bottom: 24px;">
                             <div style="display: inline-block; background: #fff1f2; color: #B93654; padding: 8px 16px; border-radius: 99px; font-size: 12px; font-weight: 800; border: 1px solid #fecdd3;">
                                🛡️ YOU ARE NOW MONITORING THIS SITE
                             </div>
                        </div>

                        <h2 style="color: #0f172a; font-size: 20px; line-height: 1.4; margin-bottom: 24px; font-weight: 800; text-align: center;">${tender.title}</h2>

                        <!-- Data Card -->
                        <div style="background: #fdf2f8; border: 1px solid #fce7f3; border-radius: 20px; padding: 24px; margin-bottom: 32px;">
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding-bottom: 16px; width: 50%;">
                                        <p style="margin: 0; font-size: 11px; text-transform: uppercase; color: #9d174d; font-weight: 700; letter-spacing: 0.5px;">Location</p>
                                        <p style="margin: 4px 0 0; font-size: 15px; font-weight: 700; color: #831843;">📍 ${tender.district || 'Nepal'}</p>
                                    </td>
                                    <td style="padding-bottom: 16px; width: 50%;">
                                        <p style="margin: 0; font-size: 11px; text-transform: uppercase; color: #9d174d; font-weight: 700; letter-spacing: 0.5px;">Est. Budget</p>
                                        <p style="margin: 4px 0 0; font-size: 15px; font-weight: 800; color: #B93654;">NPR. ${tender.budget_amount_cr || 'TBD'} Cr</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="2" style="border-top: 1px solid #fbcfe8; padding-top: 16px;">
                                        <p style="margin: 0; font-size: 11px; text-transform: uppercase; color: #9d174d; font-weight: 700; letter-spacing: 0.5px;">Deadline for Bid</p>
                                        <p style="margin: 4px 0 0; font-size: 14px; font-weight: 600; color: #be185d;">⏳ ${tender.submission_date ? new Date(tender.submission_date).toLocaleDateString() : 'Rolling Admission'}</p>
                                    </td>
                                </tr>
                            </table>
                        </div>

                        <p style="color: #4b5563; font-size: 14px; line-height: 1.6; margin-bottom: 32px; text-align: center;">
                            Our watchdog protocol is now active. We will notify you the instant a contract value is entered or a winning bidder is announced.
                        </p>

                        <div style="text-align: center;">
                            <a href="#" style="display: inline-block; background: #B93654; color: white; padding: 16px 32px; border-radius: 14px; font-weight: 700; text-decoration: none; font-size: 14px; box-shadow: 0 4px 12px rgba(185,54,84,0.25);">Track in Dashboard →</a>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div style="background: #fff1f2; border-top: 1px solid #fecdd3; padding: 24px; text-align: center;">
                        <p style="margin: 0; color: #9d174d; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px;">Bikas Ko Naksha • Civic Power Initiative</p>
                    </div>
                </div>
            </div>
        `;

        const info = await activeTransporter.sendMail({
            from: `"Third Eye Watchdog" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `🛡️ Watchdog Activated: ${tender.title}`,
            html: htmlBody
        });

        console.log(`✅ Welcome Email sent to: ${email}`);
        return true;
    } catch (error) {
        console.error("❌ Welcome email error:", error.message);
        return false;
    }
};

// Legacy alias for compatibility with existing calls
exports.notifyAward = (tenderId) => exports.notifyUpdate(tenderId, 'AWARDED');

