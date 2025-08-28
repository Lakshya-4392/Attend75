import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link to="/signup">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to signup
            </Button>
          </Link>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Terms of Service</CardTitle>
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose prose-gray dark:prose-invert max-w-none">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using Attend75, you accept and agree to be bound by the terms and provision of this agreement.
            </p>

            <h2>2. Description of Service</h2>
            <p>
              Attend75 is an attendance tracking application designed to help students monitor and manage their class attendance with real-time statistics and insights.
            </p>

            <h2>3. User Accounts</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer.
            </p>

            <h2>4. Privacy Policy</h2>
            <p>
              Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service.
            </p>

            <h2>5. Acceptable Use</h2>
            <p>
              You agree to use Attend75 only for lawful purposes and in accordance with these Terms of Service.
            </p>

            <h2>6. Data Accuracy</h2>
            <p>
              You are responsible for ensuring the accuracy of the attendance data you input into the system.
            </p>

            <h2>7. Limitation of Liability</h2>
            <p>
              Attend75 shall not be liable for any indirect, incidental, special, consequential, or punitive damages.
            </p>

            <h2>8. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting.
            </p>

            <h2>9. Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us through our support channels.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Terms;