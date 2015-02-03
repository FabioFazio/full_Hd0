<?php
namespace Test\Entity;

use Doctrine\ORM\Mapping as ORM;

/** @ORM\Entity */
class Ticket {
    /**
	 * @ORM\Id
	 * @ORM\GeneratedValue(strategy="AUTO")
	 * @ORM\Column(type="integer")
	 */
	protected $id;

	/** @ORM\Column(type="string", length=255) */
	protected $code;
	
	/** @ORM\ManyToOne(targetEntity="Queue") */
	protected $queue;

	public function getId(){
	    return $this->id;
	}
    
    public function setId($id){
    	$this->id = $id;
    }
    
    public function getCode(){
    	return $this->code;
    }
    
    public function setCode($code){
    	$this->code = $code;
    }
    
    public function getQueue(){
    	return $this->queue;
    }
    
    public function setQueue($queue){
    	$this->queue = $queue;
    }
}