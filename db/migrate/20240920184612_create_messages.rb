class CreateMessages < ActiveRecord::Migration[7.2]
  def change
    create_table :messages do |t|
      t.string :role
      t.string :bot
      t.text :content

      t.timestamps
    end

    add_index :messages, :bot
  end
end
